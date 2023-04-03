import SchemaBuilder from '@pothos/core';

import { MessagePrismaClient } from '@expoversal/prisma-clients/message-prisma-client';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin, { encodeGlobalID } from '@pothos/plugin-relay';
import { DateTimeResolver } from 'graphql-scalars';
import { lexicographicSortSchema, printSchema } from 'graphql';

import { pubsub } from '@expoversal/kafka-pub-sub';

import type { MessagePothosTypes } from '@expoversal/pothos-types';
import { printSchemaToFile } from '@expoversal/graphql-utils';

const prisma = new MessagePrismaClient({});

const builder = new SchemaBuilder<{
  Context: { currentUser: { id: string } };
  PrismaTypes: MessagePothosTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
  },
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
  },
});

builder.addScalarType('DateTime', DateTimeResolver, {});

const User = builder.objectRef<{ id: string }>('User');

builder.objectType(User, {
  fields: (t) => ({
    id: t.exposeID('id'),
  }),
});

builder.prismaNode('Message', {
  id: { field: 'id' },
  fields: (t) => ({
    createdUser: t.field({
      type: User,
      nullable: true,
      resolve: async (parent, _args, _ctx, _info) => {
        return {
          id: encodeGlobalID('User', parent.createdUserId),
        };
      },
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    content: t.exposeString('content', { nullable: true }),
    thread: t.relation('thread', { nullable: true }),
  }),
});

builder.prismaNode('Thread', {
  id: { field: 'id' },
  fields: (t) => ({
    createdUser: t.field({
      type: User,
      nullable: true,
      resolve: async (parent, _args, _ctx, _info) => {
        return {
          id: encodeGlobalID('User', parent.createdUserId),
        };
      },
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    name: t.exposeString('name', { nullable: true }),
    messages: t.relatedConnection('messages', {
      cursor: 'id',
      nullable: true,
      query: () => ({
        orderBy: {
          createdAt: 'desc',
        },
      }),
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    threads: t.prismaConnection({
      type: 'Thread',
      cursor: 'id',
      resolve: async (query) => {
        return prisma.thread.findMany({
          ...query,
          orderBy: {
            createdAt: 'desc',
          },
        });
      },
    }),
    _sdl: t.string({
      resolve: () => sdl,
    }),
  }),
});

const threadInput = builder.inputType('threadInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
  }),
});

const messageInput = builder.inputType('messageInput', {
  fields: (t) => ({
    threadId: t.id({ required: true }),
    content: t.string({ required: true }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    threadCreate: t.prismaField({
      type: 'Thread',
      args: {
        input: t.arg({ type: threadInput, required: true }),
      },
      resolve: async (query, _root, args, ctx) => {
        return prisma.thread.create({
          ...query,
          data: { createdUserId: ctx.currentUser.id, name: args.input.name },
        });
      },
    }),
    messageCreate: t.prismaField({
      type: 'Message',
      args: {
        input: t.arg({ type: messageInput, required: true }),
      },
      resolve: async (query, _root, args, ctx) => {
        return prisma.message
          .create({
            ...query,
            data: {
              threadId: String(args.input.threadId),
              createdUserId: ctx.currentUser.id,
              content: args.input.content,
            },
          })
          .then(async (message) => {
            (await pubsub).publish(
              `message-thread-${message.threadId}`,
              Buffer.from(JSON.stringify(message))
            );
            return message;
          });
      },
    }),
  }),
});
export const schema = builder.toSchema({});

export const sdl = printSchema(lexicographicSortSchema(schema));

printSchemaToFile(sdl, 'message');
