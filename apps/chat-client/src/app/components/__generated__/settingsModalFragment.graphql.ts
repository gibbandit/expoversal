/**
 * @generated SignedSource<<d30dd4ef1e37e522eb088622b62ce4a4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { InlineFragment, ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type settingsModalFragment$data = {
  readonly avatarUrl: string;
  readonly id: string;
  readonly username: string | null;
  readonly " $fragmentType": "settingsModalFragment";
};
export type settingsModalFragment$key = {
  readonly " $data"?: settingsModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"settingsModalFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "settingsModalFragment"
};

(node as any).hash = "30d0dc074370c014a3c807dcb70c84a4";

export default node;
