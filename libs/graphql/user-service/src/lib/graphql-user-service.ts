import SchemaBuilder from '@pothos/core';
import { UserPrismaClient } from '@expoversal/prisma-clients/user-prisma-client';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import { DateTimeResolver } from 'graphql-scalars';

import { lexicographicSortSchema, printSchema } from 'graphql';

import type { UserPothosTypes } from '@expoversal/pothos-types';
import { printSchemaToFile } from '@expoversal/graphql-utils';

const prisma = new UserPrismaClient({});

const builder = new SchemaBuilder<{
  Context: { currentUser: { id: string } };
  PrismaTypes: UserPothosTypes;
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

builder.prismaNode('User', {
  id: { field: 'id' },
  fields: (t) => ({
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    username: t.exposeString('username', { nullable: true }),
  }),
});

builder.queryType({
  fields: (t) => ({
    me: t.prismaField({
      type: 'User',
      nullable: true,
      resolve: async (_query, _root, _args, ctx) => {
        return prisma.user.findFirst({
          where: {
            id: ctx.currentUser.id,
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

export const schema = builder.toSchema({});

export const sdl = printSchema(lexicographicSortSchema(schema));

printSchemaToFile(sdl, 'user');
