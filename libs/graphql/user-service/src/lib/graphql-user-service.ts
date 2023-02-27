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
      type: ['User'],
      directives: {
        merge: { keyField: 'id' },
      },
      args: {
        ids: t.arg.stringList({ required: true }),
      },
      resolve: async (query, _root, args, _ctx, _info) => {
        return prisma.user.findMany({
          ...query,
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

const userInput = builder.inputType('userInput', {
  fields: (t) => ({
    username: t.string({ required: true }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    userCreate: t.prismaField({
      type: 'User',
      args: {
        input: t.arg({ type: userInput, required: true }),
      },
      resolve: async (_query, _root, args, _ctx, _info) => {
        return prisma.user.create({
          data: {
            username: args.input.username,
          },
        });
      },
    }),
  }),
});

export const schema = stitchingDirectivesValidator(builder.toSchema({}));

const sdl = printSchemaWithDirectives(lexicographicSortSchema(schema));
