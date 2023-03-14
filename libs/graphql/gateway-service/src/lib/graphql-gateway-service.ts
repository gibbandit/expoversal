import { stitchSchemas } from '@graphql-tools/stitch';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { filterSchema, pruneSchema } from '@graphql-tools/utils';
import {
  buildSchema,
  GraphQLFieldResolver,
  GraphQLSchema,
  OperationTypeNode,
} from 'graphql';
import { decodeGlobalID } from '@pothos/plugin-relay';
import { SubschemaConfig } from '@graphql-tools/delegate';
import { batchDelegateToSchema } from '@graphql-tools/batch-delegate';
import { parse } from 'graphql';
import { type Executor, isAsyncIterable } from '@graphql-tools/utils';

const { stitchingDirectivesTransformer } = stitchingDirectives();

export type SubschemaOptions = {
  serviceName: string;
  url: string;
  schema?: GraphQLSchema;
};

const subschemaTypeMap: Record<string, SubschemaConfig> = {};

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

  const canonicalTypes = config.schema.getTypeMap();
  Object.keys(canonicalTypes).forEach((typeName) => {
    const type = canonicalTypes[typeName];
    if (type.astNode?.directives?.some((d) => d.name.value === 'canonical')) {
      subschemaTypeMap[type.name] = subschemaConfig;
      console.log(
        `👑 type ${type.name} is canonical on ${config.serviceName} service`
      );
    }
  });

  return subschemaConfig;
}

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

const relayNodeResolver: GraphQLFieldResolver<any, any> = async (
  _root,
  { id },
  context,
  info
) => {
  const typeName = decodeGlobalID(id).typename;
  const subschema = subschemaTypeMap[typeName];
  if (!subschema) {
    throw new Error(`❓ Unknown node type: ${typeName}`);
  }

  console.log(`🚚 delegate ${typeName} on ${subschema.schema.description}`);

  const delegateResponse = await batchDelegateToSchema({
    schema: subschema,
    operation: 'query' as OperationTypeNode,
    fieldName: 'nodes',
    key: id,
    argsFromKeys: (ids) => ({
      ids,
    }),
    context,
    info,
  });

  console.log(
    `🚚 [DONE] delegate: ${typeName} on ${
      subschema.schema.description
    }: ${JSON.stringify(delegateResponse)}`
  );

  return delegateResponse;
};

const relayNodesResolver: GraphQLFieldResolver<any, any> = async (
  _root,
  args: { ids: string[] },
  context,
  info
) => {
  const mappedPromises = args.ids.map(async (id: string) => {
    const typeName = decodeGlobalID(id).typename;
    const subschema = subschemaTypeMap[typeName];
    if (!subschema) {
      throw new Error(`❓ Unknown node type: ${typeName}`);
    }

    console.log(`🚚 delegate: ${typeName} on ${subschema.schema.description}`);

    const delegateResponse = await batchDelegateToSchema({
      schema: subschema,
      operation: 'query' as OperationTypeNode,
      fieldName: 'nodes',
      key: id,
      argsFromKeys: (ids) => ({
        ids,
      }),
      context,
      info,
    });

    console.log(
      `🚚 [DONE] delegate: ${typeName} on ${
        subschema.schema.description
      }: ${JSON.stringify(delegateResponse)}`
    );

    return delegateResponse;
  });

  const response = await Promise.all(mappedPromises);

  return response;
};

const relayTypeDef = /* GraphQL */ `
  interface Node @canonical {
    id: ID!
  }

  type Query {
    node(id: ID!): Node @canonical
    nodes(ids: [ID!]!): [Node]! @canonical
  }
`;

export async function createGatewaySchema(
  subschemaOptions: SubschemaOptions[]
): Promise<GraphQLSchema> {
  const subschemas = await Promise.all(
    subschemaOptions.map((config) => createSubschema(config))
  );
  const schema = stitchSchemas({
    subschemas: [...subschemas],
    subschemaConfigTransforms: [stitchingDirectivesTransformer],
    typeDefs: relayTypeDef,
    resolvers: {
      Query: {
        node: relayNodeResolver,
        nodes: relayNodesResolver,
      },
    },
  });
  return schema;
}
