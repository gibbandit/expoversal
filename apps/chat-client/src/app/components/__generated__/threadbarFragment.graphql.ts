/**
 * @generated SignedSource<<fb1d3c3a1d2cf71db0fd713b62cc52b7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { InlineFragment, ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type threadbarFragment$data = {
  readonly threads: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly name: string | null;
        readonly " $fragmentSpreads": FragmentRefs<"threadbarItemFragment">;
      };
    } | null>;
  };
  readonly " $fragmentType": "threadbarFragment";
};
export type threadbarFragment$key = {
  readonly " $data"?: threadbarFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"threadbarFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "threadbarFragment"
};

(node as any).hash = "d08acc7774c22924d0c5f0f4756175a9";

export default node;
