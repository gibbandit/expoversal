import SchemaBuilder from '@pothos/core';
import DirectivePlugin from '@pothos/plugin-directives';
import { MessagePrismaClient } from '@expoversal/prisma-clients/message-prisma-client';
import PrismaPlugin from '@pothos/plugin-prisma';
import { DateTimeResolver } from 'graphql-scalars';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { lexicographicSortSchema } from 'graphql';
import { printSchemaWithDirectives } from '@graphql-tools/utils';

import type { MessagePothosTypes } from '@expoversal/pothos-types';

const { stitchingDirectivesValidator } = stitchingDirectives();

const prisma = new MessagePrismaClient({});

const builder = new SchemaBuilder<{
  PrismaTypes: MessagePothosTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
  Directives: {
    merge: {
      locations: 'FIELD_DEFINITION';
      args: {
        keyField?: String;
        keyArg?: String;
        additionalArgs?: String;
        key?: [String];
        argsExpr?: String;
      };
    };
    key: {
      locations: 'OBJECT';
      args: { selectionSet: String };
    };
    computed: {
      locations: 'FIELD_DEFINITION';
      args: { selectionSet: String };
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
    messages: t.relation('messages'),
  }),
});

builder.queryType({
  fields: (t) => ({
    threads: t.prismaField({
      type: ['Thread'],
      resolve: async (query, _root, _args, _ctx, _info) => {
        return prisma.thread.findMany({ ...query });
      },
    }),
    thread: t.prismaField({
      type: 'Thread',
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, _root, args, _ctx, _info) => {
        return prisma.thread.findUniqueOrThrow({
          ...query,
          where: {
            id: String(args.id),
          },
        });
      },
    }),
    _sdl: t.string({
      resolve: () => sdl,
    }),
  }),
});

export const schema = stitchingDirectivesValidator(builder.toSchema({}));

const sdl = printSchemaWithDirectives(lexicographicSortSchema(schema));
