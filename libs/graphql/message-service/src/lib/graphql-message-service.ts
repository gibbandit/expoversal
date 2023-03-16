import SchemaBuilder from '@pothos/core';
import DirectivePlugin from '@pothos/plugin-directives';
import { MessagePrismaClient } from '@expoversal/prisma-clients/message-prisma-client';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin, {
  decodeGlobalID,
  encodeGlobalID,
} from '@pothos/plugin-relay';
import { DateTimeResolver } from 'graphql-scalars';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { lexicographicSortSchema } from 'graphql';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { pubsub } from '@expoversal/kafka-pub-sub';

import type { MessagePothosTypes } from '@expoversal/pothos-types';
import { printSchemaToFile } from '@expoversal/graphql-tools';

const { stitchingDirectivesValidator, allStitchingDirectives } =
  stitchingDirectives();

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

const User = builder.objectRef<{ id: string }>('User');

builder.node(User, {
  id: {
    resolve: (user) => user.id,
  },
});

builder.prismaNode('Message', {
  id: { field: 'id' },
  directives: {
    canonical: {},
  },
  fields: (t) => ({
    createdUser: t.field({
      type: User,
      nullable: true,
      resolve: async (parent, _args, _ctx, _info) => {
        return {
          id: parent.createdUserId,
        };
      },
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    content: t.exposeString('content', { nullable: true }),
    thread: t.relation('thread', { nullable: true }),
  }),
});

builder.prismaNode('Thread', {
  id: { field: 'id' },
  directives: {
    canonical: {},
  },
  fields: (t) => ({
    createdUser: t.field({
      type: User,
      nullable: true,
      resolve: async (parent, _args, _ctx, _info) => {
        return {
          id: parent.createdUserId,
        };
      },
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: true }),
    name: t.exposeString('name', { nullable: true }),
    messages: t.relation('messages', { nullable: true }),
  }),
});

builder.queryType({
  fields: (t) => ({
    threads: t.prismaField({
      type: ['Thread'],
      directives: {
        merge: { keyField: 'id' },
        canonical: {},
      },
      args: {
        ids: t.arg.idList({ required: false }),
      },
      resolve: async (query, _root, args, _ctx, _info) => {
        if (args.ids) {
          const dbIds = args.ids.map((id) => {
            return decodeGlobalID(id.toString()).id;
          });
          return prisma.thread.findMany({
            ...query,
            orderBy: {
              createdAt: 'desc',
            },
            where: {
              id: {
                in: dbIds,
              },
            },
          });
        } else {
          return prisma.thread.findMany({
            ...query,
          });
        }
      },
    }),
    messages: t.prismaField({
      type: ['Message'],
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
        return prisma.message.findMany({
          ...query,
          orderBy: {
            createdAt: 'desc',
          },
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
export const schema = stitchingDirectivesValidator(
  builder.toSchema({ directives: allStitchingDirectives })
);

export const sdl = printSchemaWithDirectives(lexicographicSortSchema(schema));

printSchemaToFile(sdl, 'message');
