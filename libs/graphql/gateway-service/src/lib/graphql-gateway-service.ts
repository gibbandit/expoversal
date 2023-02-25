import { stitchSchemas } from '@graphql-tools/stitch';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { schema as userSchema } from '@expoversal/graphql-user-service';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { schema as messageSchema } from '@expoversal/graphql-message-service';
import { GraphQLSchema } from 'graphql';

const { stitchingDirectivesTransformer } = stitchingDirectives();

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

export const schema = sanatizeSchema(
  stitchSchemas({
    subschemas: [userSubschema, messageSubschema],
    subschemaConfigTransforms: [stitchingDirectivesTransformer],
  })
);

function sanatizeSchema(schema: GraphQLSchema): GraphQLSchema {
  const queryType = schema.getQueryType();
  if (queryType) {
    const fields = queryType.getFields();
    delete fields._sdl;
  }
  return schema;
}

export default schema;
