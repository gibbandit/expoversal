/**
 * @generated SignedSource<<810d227c620e7888ea32019596ac04cf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ThreadCreateInput = {
  name: string;
};
export type newThreadModalThreadCreateMutation$variables = {
  connections: ReadonlyArray<string>;
  input: ThreadCreateInput;
};
export type newThreadModalThreadCreateMutation$data = {
  readonly threadCreate: {
    readonly threadEdge: {
      readonly node: {
        readonly createdAt: any | null;
        readonly id: string;
        readonly name: string | null;
      };
    };
  };
};
export type newThreadModalThreadCreateMutation = {
  response: newThreadModalThreadCreateMutation$data;
  variables: newThreadModalThreadCreateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "ThreadConnectionEdge",
  "kind": "LinkedField",
  "name": "threadEdge",
  "plural": false,
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
          "name": "createdAt",
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "newThreadModalThreadCreateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ThreadCreatePayload",
        "kind": "LinkedField",
        "name": "threadCreate",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "newThreadModalThreadCreateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ThreadCreatePayload",
        "kind": "LinkedField",
        "name": "threadCreate",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "threadEdge",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a673abe89aa57678aabd5a60427bc150",
    "id": null,
    "metadata": {},
    "name": "newThreadModalThreadCreateMutation",
    "operationKind": "mutation",
    "text": "mutation newThreadModalThreadCreateMutation(\n  $input: ThreadCreateInput!\n) {\n  threadCreate(input: $input) {\n    threadEdge {\n      node {\n        id\n        createdAt\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "749977226f19e971736875ad7cc788a6";

export default node;
