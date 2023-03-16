import { writeFileSync } from 'fs';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { GraphQLSchema, lexicographicSortSchema } from 'graphql';

export function printSchemaToFile(
  schema: GraphQLSchema | string,
  fileName: string
) {
  if (schema instanceof GraphQLSchema) {
    schema = printSchemaWithDirectives(lexicographicSortSchema(schema));
  }
  writeFileSync(`./graphql/${fileName}.graphql`, schema);
}
