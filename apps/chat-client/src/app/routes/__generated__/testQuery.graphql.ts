/**
 * @generated SignedSource<<aeb345c4fa9e2ec0bc72070b8285dcb9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type testQuery$variables = {};
export type testQuery$data = {
  readonly me: {
    readonly id: string;
    readonly username: string | null;
  } | null;
};
export type testQuery = {
  response: testQuery$data;
  variables: testQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "username",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "testQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "testQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "6dcdc427687c9b91db2c5d3a26714323",
    "id": null,
    "metadata": {},
    "name": "testQuery",
    "operationKind": "query",
    "text": "query testQuery {\n  me {\n    id\n    username\n  }\n}\n"
  }
};
})();

(node as any).hash = "638a73b9d4c79014543598837291eda8";

export default node;
