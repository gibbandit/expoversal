/**
 * @generated SignedSource<<dca221f6e9afdf6d1996a258f4409324>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UserViewerAuthInput = {
  username: string;
};
export type viewerMutation$variables = {
  input: UserViewerAuthInput;
};
export type viewerMutation$data = {
  readonly userViewerAuth: {
    readonly viewer: {
      readonly avatarUrl: string;
      readonly id: string;
      readonly username: string | null;
    };
  };
};
export type viewerMutation = {
  response: viewerMutation$data;
  variables: viewerMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UserViewerAuthPayload",
    "kind": "LinkedField",
    "name": "userViewerAuth",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "avatarUrl",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "viewerMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "viewerMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "eacfe0ce081303002aa2aba701100f34",
    "id": null,
    "metadata": {},
    "name": "viewerMutation",
    "operationKind": "mutation",
    "text": "mutation viewerMutation(\n  $input: UserViewerAuthInput!\n) {\n  userViewerAuth(input: $input) {\n    viewer {\n      id\n      username\n      avatarUrl\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1a6877928d5ce429a99e2a8e0a1d2386";

export default node;
