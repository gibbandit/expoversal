/**
 * @generated SignedSource<<ee945ace53385a8621d37d71430d316c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UserChangeUsernameInput = {
  username: string;
};
export type settingsModalChangeUsernameMutation$variables = {
  input: UserChangeUsernameInput;
};
export type settingsModalChangeUsernameMutation$data = {
  readonly userChangeUsername: {
    readonly viewer: {
      readonly id: string;
      readonly username: string | null;
    };
  };
};
export type settingsModalChangeUsernameMutation = {
  response: settingsModalChangeUsernameMutation$data;
  variables: settingsModalChangeUsernameMutation$variables;
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
    "concreteType": "UserChangeUsernamePayload",
    "kind": "LinkedField",
    "name": "userChangeUsername",
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
            "name": "username",
            "storageKey": null
          },
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
    "name": "settingsModalChangeUsernameMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "settingsModalChangeUsernameMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a5b56f07160cadfc0fd9fd7b02d62713",
    "id": null,
    "metadata": {},
    "name": "settingsModalChangeUsernameMutation",
    "operationKind": "mutation",
    "text": "mutation settingsModalChangeUsernameMutation(\n  $input: UserChangeUsernameInput!\n) {\n  userChangeUsername(input: $input) {\n    viewer {\n      username\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fbb1c6c3c1601e639561c466d680cc66";

export default node;
