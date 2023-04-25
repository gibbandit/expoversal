import { GraphQLSchema } from 'graphql';
import { filterSchema, pruneSchema } from '@graphql-tools/utils';

export class RemovePrivateElementsTransform {
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
