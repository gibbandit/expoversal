import SchemaBuilder from '@pothos/core';
import DirectivePlugin from '@pothos/plugin-directives';
import { MessagePrismaClient } from '@expoversal/prisma-clients/message-prisma-client';
import PrismaPlugin from '@pothos/plugin-prisma';
import { DateTimeResolver } from 'graphql-scalars';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { lexicographicSortSchema } from 'graphql';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { pubsub } from '@expoversal/kafka-pub-sub';

import type { MessagePothosTypes } from '@expoversal/pothos-types';

const { stitchingDirectivesValidator } = stitchingDirectives();

const prisma = new MessagePrismaClient({});

const builder = new SchemaBuilder<{
  Context: { currentUser: { id: string } };
  PrismaTypes: MessagePothosTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
  Directives: {
    merge: {
      locations: 'FIELD_DEFINITION';
      args: {
        keyField?: string;
        keyArg?: string;
        additionalArgs?: string;
        key?: [string];
        argsExpr?: string;
      };
    };
    key: {
      locations: 'OBJECT';
      args: { selectionSet?: string };
    };
    computed: {
      locations: 'FIELD_DEFINITION';
      args: { selectionSet?: string };
    };
    canonical: {
      locations:
        | 'OBJECT'
        | 'INTERFACE'
        | 'INPUT_OBJECT'
        | 'UNION'
        | 'ENUM'
        | 'SCALAR'
        | 'FIELD_DEFINITION'
        | 'INPUT_FIELD_DEFINITION';
    };
  };
}>({
  plugins: [PrismaPlugin, DirectivePlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
  },
  useGraphQLToolsUnorderedDirectives: true,
});

builder.addScalarType('DateTime', DateTimeResolver, {});

const User = builder.objectRef<{ id: string }>('User');

builder.objectType(User, {
  fields: (t) => ({
    id: t.exposeID('id'),
  }),
});

builder.prismaObject('Message', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdUser: t.field({
      type: User,
      resolve: async (parent, _args, _ctx, _info) => {
        return {
          id: parent.createdUserId,
        };
      },
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    content: t.exposeString('content'),
    thread: t.relation('thread'),
  }),
});

builder.prismaObject('Thread', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdUser: t.field({
      type: User,
      resolve: async (parent, _args, _ctx, _info) => {
        return {
          id: parent.createdUserId,
        };
      },
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    name: t.exposeString('name'),
    messages: t.relation('messages'),
  }),
});

builder.queryType({
  fields: (t) => ({
    threads: t.prismaField({
      type: ['Thread'],
      directives: {
        merge: { keyField: 'id' },
      },
      args: {
        ids: t.arg.stringList({ required: false }),
      },
      resolve: async (query, _root, args, _ctx, _info) => {
        return args.ids
          ? prisma.thread.findMany({
              ...query,
              orderBy: {
                createdAt: 'desc',
              },
              where: {
                id: {
                  in: args.ids,
                },
              },
            })
          : prisma.thread.findMany({
              ...query,
            });
      },
    }),
    messages: t.prismaField({
      type: ['Message'],
      directives: {
        merge: { keyField: 'id' },
      },
      args: {
        ids: t.arg.stringList({ required: true }),
      },
      resolve: async (query, _root, args, _ctx, _info) => {
        return prisma.message.findMany({
          ...query,
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            id: {
              in: args.ids,
            },
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
      resolve: async (query, _root, args, ctx, _info) => {
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
      resolve: async (query, _root, args, ctx, _info) => {
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
export const schema = stitchingDirectivesValidator(builder.toSchema({}));

const sdl = printSchemaWithDirectives(lexicographicSortSchema(schema));
