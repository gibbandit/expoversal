/**
 * @generated SignedSource<<f6ef17e605dbfe3c3c8505dd5de0cea8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type testQuery$variables = {};
export type testQuery$data = {
  readonly viewer: {
    readonly id: string;
    readonly username: string | null;
  } | null;
};
export type testQuery = {
  response: testQuery$data;
  variables: testQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
    {
      alias: null,
      args: null,
      concreteType: 'User',
      kind: 'LinkedField',
      name: 'viewer',
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'id',
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'username',
          storageKey: null,
        },
      ],
      storageKey: null,
    },
  ];
  return {
    fragment: {
      argumentDefinitions: [],
      kind: 'Fragment',
      metadata: null,
      name: 'testQuery',
      selections: v0 /*: any*/,
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: [],
      kind: 'Operation',
      name: 'testQuery',
      selections: v0 /*: any*/,
    },
    params: {
      cacheID: '98bc54b1cd34384f570c128dcaa4b641',
      id: null,
      metadata: {},
      name: 'testQuery',
      operationKind: 'query',
      text: 'query testQuery {\n  viewer {\n    id\n    username\n  }\n}\n',
    },
  };
})();

(node as any).hash = '4e3049a706189ed5bbcb64388667cd3b';

export default node;
