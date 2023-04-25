/**
 * @generated SignedSource<<cebe824e9492104a68ad93c3504d1bc6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type chatViewQuery$variables = {};
export type chatViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"threadbarFragment">;
};
export type chatViewQuery = {
  response: chatViewQuery$data;
  variables: chatViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 100
      }
    ],
    "concreteType": "QueryThreadsConnection",
    "kind": "LinkedField",
    "name": "threads",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "QueryThreadsConnectionEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Thread",
            "kind": "LinkedField",
            "name": "node",
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
                "name": "name",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "threads(first:100)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "chatViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "threadbarFragment",
        "selections": (v0/*: any*/),
        "args": null,
        "argumentDefinitions": []
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "chatViewQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "baa181bfeb3db4be5e2296f5e3576b4a",
    "id": null,
    "metadata": {},
    "name": "chatViewQuery",
    "operationKind": "query",
    "text": "query chatViewQuery {\n  ...threadbarFragment\n}\n\nfragment threadbarFragment on Query {\n  threads(first: 100) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cad62ce0231e2c579fad2d0b17f9d36d";

export default node;
