/**
 * @generated SignedSource<<fcd33ac6957f085d09b47a51f0b52cb7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UserChangeAvatarSeedInput = {
  avatarSeed: string;
};
export type settingsModalChangeAvatarMutation$variables = {
  input: UserChangeAvatarSeedInput;
};
export type settingsModalChangeAvatarMutation$data = {
  readonly userChangeAvatarSeed: {
    readonly viewer: {
      readonly avatarUrl: string;
      readonly id: string;
    };
  };
};
export type settingsModalChangeAvatarMutation = {
  response: settingsModalChangeAvatarMutation$data;
  variables: settingsModalChangeAvatarMutation$variables;
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
    "concreteType": "UserChangeAvatarSeedPayload",
    "kind": "LinkedField",
    "name": "userChangeAvatarSeed",
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
            "name": "avatarUrl",
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
    "name": "settingsModalChangeAvatarMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "settingsModalChangeAvatarMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ef6151e2c5d47dc2ad3e80962ccba83f",
    "id": null,
    "metadata": {},
    "name": "settingsModalChangeAvatarMutation",
    "operationKind": "mutation",
    "text": "mutation settingsModalChangeAvatarMutation(\n  $input: UserChangeAvatarSeedInput!\n) {\n  userChangeAvatarSeed(input: $input) {\n    viewer {\n      avatarUrl\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "13bf6d1b45d0d6630dd35fb4a0db498e";

export default node;
