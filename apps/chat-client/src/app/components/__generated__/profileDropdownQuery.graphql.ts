/**
 * @generated SignedSource<<ce4e31e613411661d8a74bbad0a1cf50>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type profileDropdownQuery$variables = {};
export type profileDropdownQuery$data = {
  readonly viewer: {
    readonly avatarUrl: string;
    readonly id: string;
    readonly username: string | null;
    readonly " $fragmentSpreads": FragmentRefs<"profileModalFragment">;
  } | null;
};
export type profileDropdownQuery = {
  response: profileDropdownQuery$data;
  variables: profileDropdownQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v3 = [
  (v0/*: any*/),
  (v1/*: any*/),
  (v2/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "profileDropdownQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineDataFragmentSpread",
            "name": "profileModalFragment",
            "selections": (v3/*: any*/),
            "args": null,
            "argumentDefinitions": []
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "profileDropdownQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d982687d4b032f02330c2b65687f5b90",
    "id": null,
    "metadata": {},
    "name": "profileDropdownQuery",
    "operationKind": "query",
    "text": "query profileDropdownQuery {\n  viewer {\n    id\n    username\n    avatarUrl\n    ...profileModalFragment\n  }\n}\n\nfragment profileModalFragment on User {\n  id\n  username\n  avatarUrl\n}\n"
  }
};
})();

(node as any).hash = "5bf82dda36dde937553ed462a7a2bf75";

export default node;
