/**
 * @generated SignedSource<<bc75d18ceb15fcfefdaabcb800e8b3ff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type viewerQuery$variables = {};
export type viewerQuery$data = {
  readonly viewer: {
    readonly avatarUrl: string;
    readonly id: string;
    readonly username: string | null;
    readonly " $fragmentSpreads": FragmentRefs<"profileDropdownFragment">;
  } | null;
};
export type viewerQuery = {
  response: viewerQuery$data;
  variables: viewerQuery$variables;
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
    "name": "viewerQuery",
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
            "name": "profileDropdownFragment",
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
    "name": "viewerQuery",
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
    "cacheID": "350f6bca71dd8ac7a03afb45c0efa100",
    "id": null,
    "metadata": {},
    "name": "viewerQuery",
    "operationKind": "query",
    "text": "query viewerQuery {\n  viewer {\n    id\n    username\n    avatarUrl\n    ...profileDropdownFragment\n  }\n}\n\nfragment profileDropdownFragment on User {\n  id\n  username\n  avatarUrl\n  ...profileModalFragment\n}\n\nfragment profileModalFragment on User {\n  id\n  username\n  avatarUrl\n}\n"
  }
};
})();

(node as any).hash = "371c094b64f83015e794d06e99036428";

export default node;
