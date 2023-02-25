import SchemaBuilder from '@pothos/core';
import { UserPrismaClient } from '@expoversal/prisma-clients/user-prisma-client';
import PrismaPlugin from '@pothos/plugin-prisma';
import { DateTimeResolver } from 'graphql-scalars';

import type { UserPothosTypes } from '@expoversal/pothos-types';

const prisma = new UserPrismaClient({});

const builder = new SchemaBuilder<{
  PrismaTypes: UserPothosTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
  },
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
      resolve: async (query, _root, _args, _ctx, _info) => {
        return prisma.user.findMany({ ...query });
      },
    }),
    user: t.prismaField({
      type: 'User',
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, _root, args, _ctx, _info) => {
        return prisma.user.findUniqueOrThrow({
          ...query,
          where: {
            id: String(args.id),
          },
        });
      },
    }),
  }),
});

export const schema = builder.toSchema();
