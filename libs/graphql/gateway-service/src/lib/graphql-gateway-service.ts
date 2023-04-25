import { stitchSchemas } from '@graphql-tools/stitch';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import {
  type Executor,
  isAsyncIterable,
  filterSchema,
  pruneSchema,
} from '@graphql-tools/utils';
import { buildSchema, GraphQLSchema, printSchema, parse } from 'graphql';
import { decodeGlobalID } from '@pothos/plugin-relay';
import { SubschemaConfig } from '@graphql-tools/delegate';
import { handleRelaySubschemas } from './relay';

import { printSchemaToFile } from '@expoversal/graphql-utils';

export type SubschemaOptions = {
  serviceName: string;
  url: string;
  schema?: GraphQLSchema;
};

async function fetchRemoteSchema(executor: Executor) {
  const introspectionResult = await executor({
    document: parse(`{ _sdl }`),
  });
  if (isAsyncIterable(introspectionResult)) {
    throw new Error('🚨 Expected executor to return a single result');
  }
  return buildSchema(introspectionResult.data._sdl);
}

class RemovePrivateElementsTransform {
  transformSchema(originalWrappingSchema: GraphQLSchema) {
    const isPublicName = (name?: string) => !name?.startsWith('_');
    return pruneSchema(
      filterSchema({
        schema: originalWrappingSchema,
        typeFilter: (typeName) => isPublicName(typeName),
        rootFieldFilter: (_operationName, fieldName) => isPublicName(fieldName),
        fieldFilter: (_typeName, fieldName) => isPublicName(fieldName),
        argumentFilter: (_typeName, _fieldName, argName) =>
          isPublicName(argName),
      })
    );
  }
}
async function createSubschema(
  config: SubschemaOptions
): Promise<SubschemaConfig> {
  if (!config.schema) {
    const executor: Executor = buildHTTPExecutor({ endpoint: config.url });
    config.schema = await fetchRemoteSchema(executor);
  }

  config.schema.description = `${config.serviceName} service`;

  const subschemaConfig: SubschemaConfig = {
    schema: config.schema,
    executor: buildHTTPExecutor({
      endpoint: config.url,
      headers: (executorRequest) => ({
        authorization: executorRequest?.context?.authHeader,
      }),
    }),
    transforms: [new RemovePrivateElementsTransform()],
    batch: true,
  };

  return subschemaConfig;
}

export async function createGatewaySchema(
  subschemaOptions: SubschemaOptions[]
): Promise<GraphQLSchema> {
  const subschemas = await Promise.all(
    subschemaOptions.map((config) => createSubschema(config))
  );
  const schema = stitchSchemas({
    subschemas: handleRelaySubschemas(subschemas, (id) => {
      return decodeGlobalID(id).typename;
    }),
    mergeTypes: true,
  });
  printSchemaToFile(printSchema(schema), 'gateway');
  return schema;
}
