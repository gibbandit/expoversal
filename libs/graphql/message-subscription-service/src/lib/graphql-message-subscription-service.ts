import { makeExecutableSchema } from '@graphql-tools/schema';
import { DateTimeTypeDefinition, DateTimeResolver } from 'graphql-scalars';
import { lexicographicSortSchema, printSchema } from 'graphql';

import { pubsub } from '@expoversal/kafka-pub-sub';
import { KafkaMessage } from 'kafkajs';

export const schema = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    ${DateTimeTypeDefinition}
    type Query {
      _sdl: String!
    }

    interface Node {
      id: ID!
    }

    type Message implements Node {
      id: ID!
      createdAt: DateTime
      content: String
      createdUser: User
      thread: Thread
    }

    type User implements Node {
      id: ID!
    }

    type Thread implements Node {
      id: ID!
    }

    type Subscription {
      threadMessageUpdates(threadId: ID!): Message!
    }
  `,
  resolvers: {
    DateTime: DateTimeResolver,
    Query: {
      _sdl: () => sdl,
    },
    Subscription: {
      threadMessageUpdates: {
        resolve: (payload: KafkaMessage) => {
          const message = JSON.parse(payload.value?.toString() || '');
          return {
            id: message.id,
            createdAt: message.createdAt,
            content: message.content,
            createdUser: {
              id: message.createdUserId,
            },
            thread: {
              id: message.threadId,
            },
          };
        },
        subscribe: async (_, args) => {
          const res = (await pubsub).asyncIterator<any>(
            `message-thread-${args.threadId}`
          );
          return res;
        },
      },
    },
  },
});

export const sdl = printSchema(lexicographicSortSchema(schema));
