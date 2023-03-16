import SchemaBuilder from '@pothos/core';
import DirectivePlugin from '@pothos/plugin-directives';
import { UserPrismaClient } from '@expoversal/prisma-clients/user-prisma-client';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin, { decodeGlobalID } from '@pothos/plugin-relay';
import { DateTimeResolver } from 'graphql-scalars';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { GraphQLDirective, lexicographicSortSchema } from 'graphql';
import { printSchemaWithDirectives } from '@graphql-tools/utils';

import type { UserPothosTypes } from '@expoversal/pothos-types';
import { printSchemaToFile } from '@expoversal/graphql-utils';

const { stitchingDirectivesValidator, allStitchingDirectives } =
  stitchingDirectives();

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
  plugins: [PrismaPlugin, DirectivePlugin, RelayPlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
  },
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
  },
  useGraphQLToolsUnorderedDirectives: true,
});

builder.addScalarType('DateTime', DateTimeResolver, {});

builder.prismaNode('User', {
  id: { field: 'id' },
  directives: {
    canonical: {},
  },
  fields: (t) => ({
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    username: t.exposeString('username', { nullable: true }),
  }),
});

builder.queryType({
  fields: (t) => ({
    users: t.prismaField({
      type: ['User'],
      directives: {
        merge: { keyField: 'id' },
        canonical: {},
      },
      args: {
        ids: t.arg.idList({ required: true }),
      },
      resolve: async (query, _root, args, _ctx, _info) => {
        const dbIds = args.ids.map((id) => {
          return decodeGlobalID(id.toString()).id;
        });
        return prisma.user.findMany({
          ...query,
          where: {
            id: {
              in: dbIds,
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

export const schema = stitchingDirectivesValidator(
  builder.toSchema({ directives: allStitchingDirectives })
);

export const sdl = printSchemaWithDirectives(lexicographicSortSchema(schema));

printSchemaToFile(sdl, 'user');
