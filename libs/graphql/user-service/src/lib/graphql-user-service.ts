import SchemaBuilder from '@pothos/core';
import PrismaPlugin, { PrismaClient } from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { DateTimeResolver } from 'graphql-scalars';

import { userPrismaClient as prisma } from '@expoversal/prisma-clients';

import { lexicographicSortSchema, printSchema } from 'graphql';

import type { UserPothosTypes } from '@expoversal/pothos-types';
import { printSchemaToFile } from '@expoversal/graphql-utils';
const avatar_url = process.env.AVATAR_URL ?? 'http://localhost:3004/avatar';

const builder = new SchemaBuilder<{
  Context: { User: { id: string } };
  PrismaTypes: UserPothosTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
  AuthScopes: {
    private: boolean;
  };
}>({
  plugins: [RelayPlugin, ScopeAuthPlugin, PrismaPlugin],
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
    private: !!context.User,
  }),
  scopeAuthOptions: {
    authorizeOnSubscribe: true,
  },
});

builder.addScalarType('DateTime', DateTimeResolver, {});

const userNode = builder.prismaNode('User', {
  id: { field: 'id' },
  fields: (t) => ({
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    username: t.exposeString('username', { nullable: true }),
    avatarUrl: t.string({
      resolve: (root) => {
        return `${avatar_url}/${root.avatarSeed}.svg`;
      },
    }),
  }),
});

const AuthResult = builder.objectRef<{ id: string }>('AuthResult');

builder.objectType(AuthResult, {
  fields: (t) => ({
    id: t.exposeID('id'),
  }),
});

builder.queryType({
  fields: (t) => ({
    viewer: t.prismaField({
      authScopes: {
        private: true,
      },
      type: 'User',
      nullable: true,
      resolve: async (_query, _root, _args, ctx) => {
        return prisma.user.findUnique({
          where: {
            id: ctx.User.id,
          },
        });
      },
      unauthorizedResolver: () => null,
    }),
    _authUser: t.field({
      type: AuthResult,
      args: {
        username: t.arg({ type: 'String', required: true }),
      },
      nullable: true,
      resolve: async (_root, args, _ctx) => {
        return prisma.user.upsert({
          where: {
            username: args.username,
          },
          create: {
            username: args.username,
          },
          update: {},
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
  'userChangeAvatarSeed',
  {
    inputFields: (t) => ({
      avatarSeed: t.string({ required: true }),
    }),
  },
  {
    resolve: async (_root, args, ctx, _info) => {
      return prisma.user.update({
        where: {
          id: ctx.User.id,
        },
        data: {
          avatarSeed: args.input.avatarSeed,
        },
      });
    },
  },
  {
    outputFields: (t) => ({
      viewer: t.field({
        type: userNode,
        resolve: (result) => result,
      }),
    }),
  }
);

builder.relayMutationField(
  'userChangeUsername',
  {
    inputFields: (t) => ({
      username: t.string({ required: true }),
    }),
  },
  {
    resolve: async (_root, args, ctx, _info) => {
      return prisma.user.update({
        where: {
          id: ctx.User.id,
        },
        data: {
          username: args.input.username,
        },
      });
    },
  },
  {
    outputFields: (t) => ({
      viewer: t.field({
        type: userNode,
        resolve: (result) => result,
      }),
    }),
  }
);

export const schema = builder.toSchema({});

export const sdl = printSchema(lexicographicSortSchema(schema));

printSchemaToFile(sdl, 'user');
