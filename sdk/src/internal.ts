// Copyright (c) Miso Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// The single boundary between generated BCS-parse output (snake_case, Move-shaped)
// and the public camelCase types.

import { u256ToB64Url } from "@unconfirmed/ori";
import type { Media, Party, Profile } from "./types.ts";

/** `CountryCode` / `LanguageCode` are single-field tuple structs → parse to a 1-element array. */
function unwrapCode(v: unknown): string | undefined {
  if (v == null) return undefined;
  return Array.isArray(v) ? (v[0] as string) : (v as string);
}

// deno-lint-ignore no-explicit-any -- generated parse output is loosely typed
export function mapProfile(partyId: string, d: any): Profile {
  return {
    partyId,
    bioShort: d.bio_short,
    bioLong: d.bio_long ?? undefined,
    country: unwrapCode(d.country),
    languages: Array.isArray(d.languages)
      ? d.languages.map((l: unknown) => unwrapCode(l)).filter((c: unknown): c is string => Boolean(c))
      : [],
  };
}

// On-chain `Media` holds the quilt blob id as a u256 (decimal string from BCS);
// expose it in Walrus's base64url form so callers can build aggregator URLs.
// deno-lint-ignore no-explicit-any -- generated parse output is loosely typed
export function mapMedia(partyId: string, d: any): Media {
  return { partyId, quiltId: u256ToB64Url(String(d.quilt)) };
}

// deno-lint-ignore no-explicit-any -- generated parse output is loosely typed
export function mapParty(id: string, d: any): Party {
  const kind = d.kind;
  // PartyKind is `Individual | Group(VecSet<ID>)`. The enum parses to
  // `{ $kind, Individual? , Group? }`; Group's payload is a VecSet `{ contents }`.
  const groupPayload = kind?.Group ?? (kind?.$kind === "Group" ? kind.value : undefined);
  if (groupPayload !== undefined) {
    const contents = groupPayload?.contents ?? groupPayload ?? [];
    const members = (Array.isArray(contents) ? contents : []).map((m: unknown) =>
      typeof m === "string" ? m : (m as { id?: string })?.id ?? String(m),
    );
    return { id, kind: "group", name: d.name, members };
  }
  return { id, kind: "individual", name: d.name };
}
