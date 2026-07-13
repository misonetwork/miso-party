// Copyright (c) Miso Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Typed reads: fetch an on-chain object (or dynamic field) via the Core API, BCS-parse
// it through the generated struct, and map to the public camelCase types.

import type { ClientWithCoreApi } from "@mysten/sui/client";
import { deriveDynamicFieldID, deriveObjectID } from "@mysten/sui/utils";
import { bcs } from "@mysten/sui/bcs";
import { fromBase64 } from "@mysten/sui/utils";
import { Party as PartyBcs, MembershipKey as MembershipKeyBcs, PendingInviteKey as PendingInviteKeyBcs } from "./contracts/miso_party/party.ts";
import { Profile as ProfileBcs, ProfileKey as ProfileKeyBcs } from "./contracts/party_profile/party_profile.ts";
import { Media as MediaBcs, MediaKey as MediaKeyBcs } from "./contracts/party_media/party_media.ts";
import { mapMedia, mapParty, mapProfile } from "./internal.ts";
import type { Media, Party, Profile } from "./types.ts";

/** True for the Core API's "object does not exist" error (a missing dynamic field). */
function isNotFound(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return /not\s*found|does not exist|no object/i.test(msg);
}

// A missing object (e.g. an unset profile/media dynamic field) surfaces as a
// thrown "not found" from the Core API, not an empty result — treat it as null
// so optional extensions read cleanly.
async function getContent(client: ClientWithCoreApi, objectId: string): Promise<Uint8Array | null> {
  try {
    const { object } = await client.core.getObject({ objectId, include: { content: true } });
    return object?.content ?? null;
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
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

// Media is a dynamic field on the party UID under an empty `MediaKey()` (same
// implicit `dummy_field: bool` → one zero byte as the profile key).
const MediaField = bcs.struct("Field", { id: bcs.Address, name: MediaKeyBcs, value: MediaBcs });
const MEDIA_KEY_BYTES = MediaKeyBcs.serialize([false]).toBytes();

/** Fetches a party's media (avatar + header), or null if none is set. */
export async function getMedia(
  client: ClientWithCoreApi,
  partyId: string,
  partyMediaPackageId: string,
): Promise<Media | null> {
  const fieldId = deriveDynamicFieldID(
    partyId,
    `${partyMediaPackageId}::party_media::MediaKey`,
    MEDIA_KEY_BYTES,
  );
  const content = await getContent(client, fieldId);
  if (!content) return null;
  return mapMedia(partyId, MediaField.parse(content).value);
}

// === Group membership reads ===

/** Normalizes a dynamic-field key's BCS bytes (Uint8Array or base64 string). */
function keyBytes(bcs: unknown): Uint8Array {
  return typeof bcs === "string" ? fromBase64(bcs) : (bcs as Uint8Array);
}

/**
 * The group ids a party currently belongs to, read from its `MembershipKey`
 * dynamic fields (the member-side record). No indexer required.
 */
export async function getMemberships(client: ClientWithCoreApi, partyId: string): Promise<string[]> {
  const groups: string[] = [];
  let cursor: string | null | undefined;
  do {
    const page = await client.core.listDynamicFields({ parentId: partyId, cursor: cursor ?? undefined });
    for (const f of page.dynamicFields) {
      if (typeof f.name?.type === "string" && f.name.type.endsWith("::party::MembershipKey") && f.name.bcs != null) {
        const [groupId] = MembershipKeyBcs.parse(keyBytes(f.name.bcs));
        groups.push(String(groupId));
      }
    }
    cursor = page.hasNextPage ? page.cursor : null;
  } while (cursor);
  return groups;
}

/** The member ids invited to a group but not yet accepted (its `PendingInviteKey` fields). */
export async function getPendingInvites(client: ClientWithCoreApi, groupId: string): Promise<string[]> {
  const members: string[] = [];
  let cursor: string | null | undefined;
  do {
    const page = await client.core.listDynamicFields({ parentId: groupId, cursor: cursor ?? undefined });
    for (const f of page.dynamicFields) {
      if (typeof f.name?.type === "string" && f.name.type.endsWith("::party::PendingInviteKey") && f.name.bcs != null) {
        const [memberId] = PendingInviteKeyBcs.parse(keyBytes(f.name.bcs));
        members.push(String(memberId));
      }
    }
    cursor = page.hasNextPage ? page.cursor : null;
  } while (cursor);
  return members;
}

/** Whether `memberId` currently holds a membership record for `groupId`. */
export async function isMember(
  client: ClientWithCoreApi,
  memberId: string,
  groupId: string,
  partyPackageId: string,
): Promise<boolean> {
  const fieldId = deriveDynamicFieldID(
    memberId,
    `${partyPackageId}::party::MembershipKey`,
    MembershipKeyBcs.serialize([groupId]).toBytes(),
  );
  return (await getContent(client, fieldId)) !== null;
}
