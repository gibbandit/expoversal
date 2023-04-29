/**
 * @generated SignedSource<<577027f1d1c506fa143b2abc78d16b19>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type atomsViewerQuery$variables = {};
export type atomsViewerQuery$data = {
  readonly viewer: {
    readonly avatarUrl: string;
    readonly id: string;
    readonly username: string | null;
    readonly " $fragmentSpreads": FragmentRefs<"profileDropdownFragment">;
  } | null;
};
export type atomsViewerQuery = {
  response: atomsViewerQuery$data;
  variables: atomsViewerQuery$variables;
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
    "name": "atomsViewerQuery",
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
              },
              {
                "kind": "InlineDataFragmentSpread",
                "name": "settingsModalFragment",
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
    "name": "atomsViewerQuery",
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
    "cacheID": "f9321107267eb1475db9f2872c4c9acc",
    "id": null,
    "metadata": {},
    "name": "atomsViewerQuery",
    "operationKind": "query",
    "text": "query atomsViewerQuery {\n  viewer {\n    id\n    username\n    avatarUrl\n    ...profileDropdownFragment\n  }\n}\n\nfragment profileDropdownFragment on User {\n  id\n  username\n  avatarUrl\n  ...profileModalFragment\n  ...settingsModalFragment\n}\n\nfragment profileModalFragment on User {\n  id\n  username\n  avatarUrl\n}\n\nfragment settingsModalFragment on User {\n  id\n  username\n  avatarUrl\n}\n"
  }
};
})();

(node as any).hash = "f7277571bd69d97235a77f1489db3219";

export default node;
