import SchemaBuilder from '@pothos/core';

import { messagePrismaClient as prisma } from '@expoversal/prisma-clients';

import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin, {
  decodeGlobalID,
  encodeGlobalID,
} from '@pothos/plugin-relay';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';

import { DateTimeResolver } from 'graphql-scalars';
import { lexicographicSortSchema, printSchema } from 'graphql';

import type { MessagePothosTypes } from '@expoversal/pothos-types';
import { printSchemaToFile } from '@expoversal/graphql-utils';
import { PubSub } from 'graphql-yoga';

const builder = new SchemaBuilder<{
  Context: { User: { id: string }; pubsub: PubSub<any> };
  PrismaTypes: MessagePothosTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
  AuthScopes: {
    private: boolean;
  };
}>({
  plugins: [PrismaPlugin, RelayPlugin, ScopeAuthPlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
  },
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
  },
  authScopes: async (context) => ({
    private: !context.User.id,
  }),
  scopeAuthOptions: {
    authorizeOnSubscribe: true,
  },
});

builder.addScalarType('DateTime', DateTimeResolver, {});

const User = builder.objectRef<{ id: string }>('User');

builder.objectType(User, {
  fields: (t) => ({
    id: t.exposeID('id'),
  }),
});

const messageNode = builder.prismaNode('Message', {
  authScopes: {
    private: true,
  },
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

const threadNode = builder.prismaNode('Thread', {
  authScopes: {
    private: true,
  },
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

builder.mutationType();

builder.relayMutationField(
  'threadCreate',
  {
    inputFields: (t) => ({
      name: t.string({ required: true }),
    }),
  },
  {
    resolve: async (_root, args, ctx) => {
      return prisma.thread.create({
        data: { createdUserId: ctx.User.id, name: args.input.name },
      });
    },
  },
  {
    outputFields: (t) => ({
      thread: t.field({
        type: threadNode,
        resolve: (result) => result,
      }),
    }),
  }
);

builder.relayMutationField(
  'messageCreate',
  {
    inputFields: (t) => ({
      threadId: t.id({ required: true }),
      content: t.string({ required: true }),
    }),
  },
  {
    resolve: async (_root, args, ctx) => {
      return prisma.message
        .create({
          data: {
            threadId: decodeGlobalID(String(args.input.threadId)).id,
            createdUserId: ctx.User.id,
            content: args.input.content as string,
          },
        })
        .then(async (message) => {
          message.id = encodeGlobalID('Message', message.id);
          message.createdUserId = encodeGlobalID('User', message.createdUserId);
          message.threadId = encodeGlobalID('Thread', message.threadId);
          ctx.pubsub.publish(`message-thread-${message.threadId}`, message);
          return message;
        });
    },
  },
  {
    outputFields: (t) => ({
      message: t.field({
        type: messageNode,
        resolve: (result) => result,
      }),
    }),
  }
);

export const schema = builder.toSchema({});

export const sdl = printSchema(lexicographicSortSchema(schema));

printSchemaToFile(sdl, 'message');
