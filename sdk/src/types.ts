// Copyright (c) Miso Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Public, camelCase result types. The mappers in ./internal.ts turn the generated
// (snake_case, Move-shaped) parse output into these.

export type PartyKind = "individual" | "group";

export interface Party {
  id: string;
  kind: PartyKind;
  /** Human-readable name (not verified). */
  name: string;
  /** Member party ids — present only when `kind === "group"`. */
  members?: string[];
}

export interface Profile {
  partyId: string;
  bioShort: string;
  bioLong?: string;
  /** ISO 3166-1 alpha-2 country code, e.g. "GB". */
  country?: string;
  /** ISO 639-1 language codes, e.g. ["en"]. */
  languages: string[];
}

/**
 * A party's imagery, stored on-chain as a single Walrus quilt. Individual images
 * (avatar, header, …) are quilt patches addressed by identifier off-chain — see
 * `mediaUrls` / `MEDIA_IDENTIFIERS` in `extensions/media`.
 */
export interface Media {
  partyId: string;
  /** Walrus quilt blob id (base64url) holding the party's images. */
  quiltId: string;
}
