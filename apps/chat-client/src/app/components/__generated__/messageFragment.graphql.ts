/**
 * @generated SignedSource<<c7e12494551abfac746c775246e748da>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { InlineFragment, ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type messageFragment$data = {
  readonly content: string | null;
  readonly createdAt: any | null;
  readonly createdUser: {
    readonly avatarUrl: string;
    readonly id: string;
    readonly username: string | null;
    readonly " $fragmentSpreads": FragmentRefs<"profileModalFragment">;
  } | null;
  readonly id: string;
  readonly " $fragmentType": "messageFragment";
};
export type messageFragment$key = {
  readonly " $data"?: messageFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"messageFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "messageFragment"
};

(node as any).hash = "e9a38b696764b1a0e6b5a86d05265271";

export default node;
