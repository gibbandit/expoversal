import { makeExecutableSchema } from '@graphql-tools/schema';
import { execute } from '@graphql-tools/executor';
import { GraphQLSchema, parse } from 'graphql';
import { stitchSchemas } from '@graphql-tools/stitch';
import { SubschemaConfig } from '@graphql-tools/delegate';
import { handleRelaySubschemas } from './lib/relay';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { filterSchema, pruneSchema } from '@graphql-tools/utils';

const { stitchingDirectivesTransformer, allStitchingDirectivesTypeDefs } =
  stitchingDirectives();

function decodeBase64(str: string) {
  return Buffer.from(str, 'base64').toString('utf-8');
}
function encodeBase64(str: string) {
  return Buffer.from(str, 'utf-8').toString('base64');
}
function extractGlobalId(globalId: string) {
  const [type, id] = decodeBase64(globalId).split(':');
  return { type, id };
}
function makeGlobalId(type: string, id: string) {
  return encodeBase64(`${type}:${id}`);
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

const users = [
  {
    id: '0',
    name: 'John Doe',
  },
  {
    id: '1',
    name: 'Jane Doe',
  },
];

const posts = [
  { id: '0', content: 'Lorem Ipsum', createdUserId: users[1].id },
  { id: '1', content: 'Dolor Sit Amet', createdUserId: users[0].id },
];

const userSchema = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    ${allStitchingDirectivesTypeDefs}
    type Query {
      node(id: ID!): Node
      nodes(ids: [ID!]!): [Node!]
      users(ids: [ID!]!): [User!] @merge(keyField: "id")
    }
    interface Node {
      id: ID!
    }
    type User implements Node @key(selectionSet: "{ id }") @canonical {
      id: ID!
      name: String!
    }
  `,
  resolvers: {
    Node: {
      __resolveType: (node: any) => {
        const type = extractGlobalId(node.id)?.type;
        //console.log(node);
        if (type === 'User') {
          return type;
        }
        throw new Error('type not in schema for userSchema');
      },
      id: ({ __typename, id }: { __typename: string; id: string }) =>
        makeGlobalId(__typename, id),
    },
    Query: {
      node: (_, { id: globalId }) => {
        const { type, id } = extractGlobalId(globalId);
        switch (type) {
          case 'User':
            const user = users.find((user) => user.id === id);
            if (user) {
              return { ...user, id: makeGlobalId('User', user.id) };
            }
            throw new Error(`ID ${globalId} not found on userSubschema`);
          default:
            throw new Error(`Type ${type} not found on userSubschema`);
        }
      },
      nodes: (_, { ids: globalIds }) => {
        return globalIds.map((globalId: string) => {
          const { type, id } = extractGlobalId(globalId);
          switch (type) {
            case 'User':
              const user = users.find((user) => user.id === id);
              if (user) {
                return { ...user, id: makeGlobalId('User', user.id) };
              }
              throw new Error(`ID ${globalId} not found on userSubschema`);
            default:
              throw new Error(`Type ${type} not found on userSubschema`);
          }
        });
      },
      users: (_, { ids: globalIds }) => {
        return globalIds.map((globalId: string) => {
          const { type, id } = extractGlobalId(globalId);
          switch (type) {
            case 'User':
              const user = users.find((user) => user.id === id);
              if (user) {
                return { ...user, id: makeGlobalId('User', user.id) };
              }
              throw new Error(`ID ${globalId} not found on userSubschema`);
            default:
              throw new Error(`Type ${type} not found on userSubschema`);
          }
        });
      },
    },
  },
});

const postSchema = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    ${allStitchingDirectivesTypeDefs}
    type Query {
      node(id: ID!): Node
      nodes(ids: [ID!]!): [Node!]
      posts(ids: [ID!]!): [Post!] @merge(keyField: "id")
    }
    interface Node {
      id: ID!
    }
    type Post implements Node @key(selectionSet: "{ id }") @canonical {
      id: ID!
      content: String!
      createdUser: User!
    }

    type User implements Node {
      id: ID!
    }
  `,
  resolvers: {
    Node: {
      __resolveType: (node: any) => {
        const type = extractGlobalId(node.id)?.type;
        //console.log(node);
        if (type === 'Post') {
          return type;
        }
        throw new Error('type not in schema for postSchema');
      },
      id: ({ __typename, id }: { __typename: string; id: string }) =>
        makeGlobalId(__typename, id),
    },
    Query: {
      node: (_, { id: globalId }) => {
        const { type, id } = extractGlobalId(globalId);
        switch (type) {
          case 'Post':
            const post = posts.find((post) => post.id === id);
            if (post) {
              return {
                ...post,
                id: makeGlobalId('Post', post.id),
                createdUser: {
                  id: makeGlobalId('User', post.createdUserId),
                },
              };
            }
            throw new Error(`ID ${globalId} not found on postSubschema`);
          default:
            throw new Error('type not found in postSubschema');
        }
      },
      nodes: (_, { ids: globalIds }) => {
        return globalIds.map((globalId: string) => {
          const { type, id } = extractGlobalId(globalId);
          switch (type) {
            case 'Post':
              const post = posts.find((post) => post.id === id);
              if (post) {
                return {
                  ...post,
                  id: makeGlobalId('Post', post.id),
                  createdUser: {
                    id: makeGlobalId('User', post.createdUserId),
                  },
                };
              }
              throw new Error(`ID ${globalId} not found on postSubschema`);
            default:
              throw new Error('type not found in postSubschema');
          }
        });
      },
      posts: (_, { ids: globalIds }) => {
        return globalIds.map((globalId: string) => {
          const { type, id } = extractGlobalId(globalId);
          switch (type) {
            case 'Post':
              const post = posts.find((post) => post.id === id);
              if (post) {
                return {
                  ...post,
                  id: makeGlobalId('Post', post.id),
                  createdUser: {
                    id: makeGlobalId('User', post.createdUserId),
                  },
                };
              }
              throw new Error(`ID ${globalId} not found on postSubschema`);
            default:
              throw new Error('type not found in postSubschema');
          }
        });
      },
    },
  },
});

const subschemaConfigs: SubschemaConfig[] = [
  {
    schema: postSchema,
    batch: true,
    transforms: [new RemovePrivateElementsTransform()],
  },
  {
    schema: userSchema,
    batch: true,
    transforms: [new RemovePrivateElementsTransform()],
  },
];

const stitchedSchema = stitchSchemas({
  subschemas: handleRelaySubschemas(subschemaConfigs, (id) => {
    return extractGlobalId(id).type;
  }),
  subschemaConfigTransforms: [stitchingDirectivesTransformer],
});

/* const postResult = execute({
  schema: postSchema,
  document: parse( `
    fragment Post on Post {
      id
      content
    }

    query PostSchemaQuery {
      post0: node(id: "${makeGlobalId('Post', '0')}") {
        __typename
        id
        createdUser {
          id
        }
        ...Post
      }
      post1: node(id: "${makeGlobalId('Post', '1')}") {
        __typename
      }
    }
  `),
});

Promise.resolve(postResult).then((res) => {
  console.log(res);
}); */

const nodeIds = [
  makeGlobalId('Post', '0'),
  makeGlobalId('Post', '1'),
  makeGlobalId('User', '0'),
  makeGlobalId('User', '1'),
  //makeGlobalId('User', '77'),
];

const stitchedResult = execute({
  schema: stitchedSchema,
  document: parse(/* GraphQL */ `
    fragment Post on Post {
      id
      content
      createdUser {
        id
        name
      }
    }
    fragment User on User {
      id
      name
    }
    query PostSchemaQuery {
      post0: node(id: "${nodeIds[0]}") {
        __typename
        ...Post
      }
      post1: node(id: "${nodeIds[1]}") {
        __typename
        ...Post
      }
      user0: node(id: "${nodeIds[2]}") {
        __typename
        ...User
      }
      user1: node(id: "${nodeIds[3]}") {
        __typename
        ...User
      }
      nodes0: nodes(ids: [${nodeIds
        .map((id) => `"${id.toString()}"`)
        .join(',')}]) {
          __typename
          id
          ...Post
          ...User
        }
    }
  `),
});

Promise.resolve(stitchedResult).then((res) => {
  console.log(JSON.stringify(res, null, 2));
});
