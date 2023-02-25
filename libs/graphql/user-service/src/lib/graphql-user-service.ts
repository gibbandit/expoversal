import SchemaBuilder from '@pothos/core';
import DirectivePlugin from '@pothos/plugin-directives';
import { UserPrismaClient } from '@expoversal/prisma-clients/user-prisma-client';
import PrismaPlugin from '@pothos/plugin-prisma';
import { DateTimeResolver } from 'graphql-scalars';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { lexicographicSortSchema } from 'graphql';
import { printSchemaWithDirectives } from '@graphql-tools/utils';

import type { UserPothosTypes } from '@expoversal/pothos-types';

const { stitchingDirectivesValidator } = stitchingDirectives();

const prisma = new UserPrismaClient({});

const builder = new SchemaBuilder<{
  PrismaTypes: UserPothosTypes;
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

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    username: t.exposeString('username'),
  }),
});

builder.queryType({
  fields: (t) => ({
    users: t.prismaField({
      directives: {
        merge: { keyField: 'id' },
      },
      type: ['User'],
      args: {
        ids: t.arg.stringList({ required: true }),
      },
      resolve: async (query, _root, _args, _ctx, _info) => {
        return prisma.user.findMany({
          ...query,
          where: { id: { in: _args.ids } },
        });
      },
    }),
    user: t.prismaField({
      directives: {
        merge: { keyField: 'id' },
      },
      type: 'User',
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (query, _root, args, _ctx, _info) => {
        return prisma.user.findUniqueOrThrow({
          ...query,
          where: {
            id: args.id,
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
