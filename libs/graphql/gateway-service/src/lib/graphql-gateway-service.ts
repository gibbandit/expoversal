import { stitchSchemas } from '@graphql-tools/stitch';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { GraphQLSchema } from 'graphql';

const { stitchingDirectivesTransformer } = stitchingDirectives();

export type SubschemaConfig = {
  url: string;
  schema: GraphQLSchema;
};

function createSubschema(url: string, schema: GraphQLSchema) {
  return {
    schema: schema,
    executor: buildHTTPExecutor({
      endpoint: url,
      headers: (executorRequest) => ({
        authorization: executorRequest?.context?.authHeader,
      }),
    }),
    batch: true,
  };
}

function sanitizeSchema(schema: GraphQLSchema): GraphQLSchema {
  const queryType = schema.getQueryType();
  if (queryType) {
    const fields = queryType.getFields();
    delete fields._sdl;
  }
  return schema;
}

export function createGatewaySchema(
  subschemaConfig: SubschemaConfig[]
): GraphQLSchema {
  const schema = stitchSchemas({
    subschemas: subschemaConfig.map((config) =>
      createSubschema(config.url, config.schema)
    ),
    subschemaConfigTransforms: [stitchingDirectivesTransformer],
  });
  return sanitizeSchema(schema);
}
