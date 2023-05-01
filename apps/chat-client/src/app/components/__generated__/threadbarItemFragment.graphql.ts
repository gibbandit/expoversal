/**
 * @generated SignedSource<<e585ed434ca838db8680e708930d3a32>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { InlineFragment, ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type threadbarItemFragment$data = {
  readonly id: string;
  readonly name: string | null;
  readonly " $fragmentType": "threadbarItemFragment";
};
export type threadbarItemFragment$key = {
  readonly " $data"?: threadbarItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"threadbarItemFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "threadbarItemFragment"
};

(node as any).hash = "3601f3b2db8b67fcbf53b29a37bdb00a";

export default node;
