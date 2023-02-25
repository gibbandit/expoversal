import SchemaBuilder from '@pothos/core';
import { MessagePrismaClient } from '@expoversal/prisma-clients/message-prisma-client';
import PrismaPlugin from '@pothos/plugin-prisma';
import { DateTimeResolver } from 'graphql-scalars';

import type { MessagePothosTypes } from '@expoversal/pothos-types';

const prisma = new MessagePrismaClient({});

const builder = new SchemaBuilder<{
  PrismaTypes: MessagePothosTypes;
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

builder.prismaObject('Message', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdUserId: t.exposeString('createdUserId'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    content: t.exposeString('content'),
    thread: t.relation('thread'),
  }),
});

builder.prismaObject('Thread', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdUserId: t.exposeString('createdUserId'),
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
  }),
});

export const schema = builder.toSchema();
