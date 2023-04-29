/**
 * @generated SignedSource<<5e32b1cf2481a193d4447394f67c58b8>>
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
export type atomsViewerMutation$variables = {
  input: UserViewerAuthInput;
};
export type atomsViewerMutation$data = {
  readonly userViewerAuth: {
    readonly viewer: {
      readonly id: string;
    };
  };
};
export type atomsViewerMutation = {
  response: atomsViewerMutation$data;
  variables: atomsViewerMutation$variables;
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
    "name": "atomsViewerMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "atomsViewerMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e25508cdb92c9b6b711ed4dd2d5f20e9",
    "id": null,
    "metadata": {},
    "name": "atomsViewerMutation",
    "operationKind": "mutation",
    "text": "mutation atomsViewerMutation(\n  $input: UserViewerAuthInput!\n) {\n  userViewerAuth(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "15575cf2bdb6c994d43e176cf4218f19";

export default node;
