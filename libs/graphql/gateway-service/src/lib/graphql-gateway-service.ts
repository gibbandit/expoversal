import { delegateToSchema } from '@graphql-tools/delegate';
import { stitchSchemas } from '@graphql-tools/stitch';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { OperationTypeNode } from 'graphql';

import { schema as userSchema } from '@expoversal/graphql-user-service';
import { schema as messageSchema } from '@expoversal/graphql-message-service';

const userRemoteExecutor = buildHTTPExecutor({
  endpoint: 'http://localhost:3001/graphql',
});

export const userSubschema = {
  schema: userSchema,
  executor: userRemoteExecutor,
};

const messageRemoteExecutor = buildHTTPExecutor({
  endpoint: 'http://localhost:3002/graphql',
});

export const messageSubschema = {
  schema: messageSchema,
  executor: messageRemoteExecutor,
};

export const schema = stitchSchemas({
  subschemas: [userSubschema, messageSubschema],
  typeDefs: /* GraphQL */ `
    extend type Message {
      createdUser: User!
    }
    extend type Thread {
      createdUser: User!
    }
  `,
  resolvers: {
    Message: {
      createdUser: {
        selectionSet: `{ createdUserId }`,
        resolve(message, _args, context, info) {
          return delegateToSchema({
            schema: userSchema,
            operation: OperationTypeNode.QUERY,
            fieldName: 'user',
            args: { id: message.createdUserId },
            context,
            info,
          });
        },
      },
    },
    Thread: {
      createdUser: {
        selectionSet: `{ createdUserId }`,
        resolve(thread, _args, context, info) {
          return delegateToSchema({
            schema: userSchema,
            operation: OperationTypeNode.QUERY,
            fieldName: 'user',
            args: { id: thread.createdUserId },
            context,
            info,
          });
        },
      },
    },
  },
});

export default schema;
