// Copyright (c) Miso Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// The `party_featured_pressing` extension: the single pressing a party headlines on
// its profile. `set_featured` takes the live `Pressing<Currency>` object (so the
// stored id is proven to be a real pressing) and keeps only its id; the value read
// back is that id. The `Currency` type argument is the pressing's coin type.

import * as featuredMod from "../contracts/party_featured_pressing/party_featured_pressing.ts";
import type { TxThunk } from "../transactions.ts";

export interface SetFeaturedPressingParams {
  partyId: string;
  capId: string;
  /** The shared `Pressing` object id to feature. */
  pressingId: string;
  /** The pressing's `Currency` type (e.g. `0x2::sui::SUI`). */
  currencyType: string;
  partyFeaturedPressingPackageId: string;
}

/** Features a pressing on the party, replacing any existing pin. */
export function setFeaturedPressing(params: SetFeaturedPressingParams): TxThunk {
  return (tx) => {
    tx.add(
      featuredMod.setFeatured({
        package: params.partyFeaturedPressingPackageId,
        arguments: [params.partyId, params.capId, params.pressingId],
        typeArguments: [params.currencyType],
      }),
    );
  };
}

export interface ClearFeaturedPressingParams {
  partyId: string;
  capId: string;
  partyFeaturedPressingPackageId: string;
}

/** Removes the party's featured pressing. No-op on-chain if none is set. */
export function clearFeaturedPressing(params: ClearFeaturedPressingParams): TxThunk {
  return (tx) => {
    tx.add(
      featuredMod.clearFeatured({
        package: params.partyFeaturedPressingPackageId,
        arguments: [params.partyId, params.capId],
      }),
    );
  };
}
