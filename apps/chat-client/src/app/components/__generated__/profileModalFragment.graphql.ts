/**
 * @generated SignedSource<<e9ac1f6f31483ce501bccfce48ebf407>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { InlineFragment, ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type profileModalFragment$data = {
  readonly avatarUrl: string;
  readonly id: string;
  readonly username: string | null;
  readonly " $fragmentType": "profileModalFragment";
};
export type profileModalFragment$key = {
  readonly " $data"?: profileModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"profileModalFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "profileModalFragment"
};

(node as any).hash = "e3cf642fc105f6d99d7261a1b6cd277e";

export default node;
