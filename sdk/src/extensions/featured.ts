// Copyright (c) Miso Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// The `party_featured_drop` extension: the single drop a party headlines on
// its profile. `set_featured` takes the live `Drop<Currency>` object (so the
// stored id is proven to be a real drop) and keeps only its id; the value read
// back is that id. The `Currency` type argument is the drop's coin type.

import * as featuredMod from "../contracts/party_featured_drop/party_featured_drop.ts";
import type { TxThunk } from "../transactions.ts";

export interface SetFeaturedDropParams {
  partyId: string;
  capId: string;
  /** The shared `Drop` object id to feature. */
  dropId: string;
  /** The drop's `Currency` type (e.g. `0x2::sui::SUI`). */
  currencyType: string;
  partyFeaturedDropPackageId: string;
}

/** Features a drop on the party, replacing any existing pin. */
export function setFeaturedDrop(params: SetFeaturedDropParams): TxThunk {
  return (tx) => {
    tx.add(
      featuredMod.setFeatured({
        package: params.partyFeaturedDropPackageId,
        arguments: [params.partyId, params.capId, params.dropId],
        typeArguments: [params.currencyType],
      }),
    );
  };
}

export interface ClearFeaturedDropParams {
  partyId: string;
  capId: string;
  partyFeaturedDropPackageId: string;
}

/** Removes the party's featured drop. No-op on-chain if none is set. */
export function clearFeaturedDrop(params: ClearFeaturedDropParams): TxThunk {
  return (tx) => {
    tx.add(
      featuredMod.clearFeatured({
        package: params.partyFeaturedDropPackageId,
        arguments: [params.partyId, params.capId],
      }),
    );
  };
}
