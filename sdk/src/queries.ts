// Copyright (c) Miso Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Typed reads: fetch an on-chain object (or dynamic field) via the Core API, BCS-parse
// it through the generated struct, and map to the public camelCase types.

import type { ClientWithCoreApi } from "@mysten/sui/client";
import { deriveDynamicFieldID, deriveObjectID } from "@mysten/sui/utils";
import { bcs } from "@mysten/sui/bcs";
import { Party as PartyBcs } from "./contracts/miso_party/party.ts";
import { Profile as ProfileBcs, ProfileKey as ProfileKeyBcs } from "./contracts/party_profile/party_profile.ts";
import { mapParty, mapProfile } from "./internal.ts";
import type { Party, Profile } from "./types.ts";

async function getContent(client: ClientWithCoreApi, objectId: string): Promise<Uint8Array | null> {
  const { object } = await client.core.getObject({ objectId, include: { content: true } });
  return object?.content ?? null;
}

/** Fetches and parses a shared `Party` object. */
export async function getPartyById(client: ClientWithCoreApi, partyId: string): Promise<Party> {
  const content = await getContent(client, partyId);
  if (!content) throw new Error(`Party not found: ${partyId}`);
  return mapParty(partyId, PartyBcs.parse(content));
}

/** Derives a party's `PartyAdminCap` id (it is a `derived_object` off the party UID). */
export function derivePartyAdminCapId(partyId: string, partyPackageId: string): string {
  return deriveObjectID(
    partyId,
    `${partyPackageId}::party::PartyAdminCapKey`,
    bcs.Address.serialize(partyId).toBytes(),
  );
}

// The profile is a dynamic field on the party UID under an empty `ProfileKey()`
// (Move's implicit `dummy_field: bool` → one zero byte).
const ProfileField = bcs.struct("Field", { id: bcs.Address, name: ProfileKeyBcs, value: ProfileBcs });
const PROFILE_KEY_BYTES = ProfileKeyBcs.serialize([false]).toBytes();

/** Fetches a party's profile, or null if none is set. */
export async function getProfile(
  client: ClientWithCoreApi,
  partyId: string,
  partyProfilePackageId: string,
): Promise<Profile | null> {
  const fieldId = deriveDynamicFieldID(
    partyId,
    `${partyProfilePackageId}::party_profile::ProfileKey`,
    PROFILE_KEY_BYTES,
  );
  const content = await getContent(client, fieldId);
  if (!content) return null;
  return mapProfile(partyId, ProfileField.parse(content).value);
}
