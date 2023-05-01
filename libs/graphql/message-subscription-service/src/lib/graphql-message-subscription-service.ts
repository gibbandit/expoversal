import { makeExecutableSchema } from '@graphql-tools/schema';
import { DateTimeTypeDefinition, DateTimeResolver } from 'graphql-scalars';
import { lexicographicSortSchema, printSchema } from 'graphql';

import { printSchemaToFile } from '@expoversal/graphql-utils';
import { decodeGlobalID } from '@pothos/plugin-relay';

export const schema = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    ${DateTimeTypeDefinition}

    type Query {
      _sdl: String!
    }

    type Message {
      id: ID!
      createdAt: DateTime
      content: String
      createdUser: User
      thread: Thread
    }

    type User {
      id: ID!
    }

    type Thread {
      id: ID!
    }

    type MessageConnectionEdge {
      cursor: String!
      node: Message!
    }

    type Subscription {
      threadMessageUpdates(threadId: ID!): MessageConnectionEdge!
    }
  `,
  resolvers: {
    DateTime: DateTimeResolver,
    Query: {
      _sdl: () => sdl,
    },
    Subscription: {
      threadMessageUpdates: {
        resolve: (payload) => {
          return {
            cursor: payload.id,
            node: {
              id: payload.id,
              createdAt: payload.createdAt,
              content: payload.content,
              createdUser: {
                id: payload.createdUserId,
              },
              thread: {
                id: payload.threadId,
              },
            },
          };
        },
        subscribe: async (_, args, ctx) =>
          ctx.pubsub.subscribe(`message-thread-${args.threadId}`),
      },
    },
  },
});

export const sdl = printSchema(lexicographicSortSchema(schema));

printSchemaToFile(sdl, 'subscription');
