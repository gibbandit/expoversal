/**
 * @generated SignedSource<<ea0b58b29dba186613cea52f875882e8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { InlineFragment, ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type profileDropdownFragment$data = {
  readonly avatarUrl: string;
  readonly id: string;
  readonly username: string | null;
  readonly " $fragmentSpreads": FragmentRefs<"profileModalFragment" | "settingsModalFragment">;
  readonly " $fragmentType": "profileDropdownFragment";
};
export type profileDropdownFragment$key = {
  readonly " $data"?: profileDropdownFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"profileDropdownFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "profileDropdownFragment"
};

(node as any).hash = "fd931cc43780c928ebbe271994e400a1";

export default node;
