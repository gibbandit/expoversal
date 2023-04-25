/**
 * @generated SignedSource<<3b36d75c5cb39e42a57507fe4955d678>>
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

(node as any).hash = "438eeca0976a0f38096151fd96c7c3b7";

export default node;
