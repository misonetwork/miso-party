// Copyright (c) Miso Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// The `party` client extension for `SuiClient#$extend()`. The caller builds the
// actual client; package ids are passed in here (never hardcoded / read from env).

import type { ClientWithCoreApi, SuiClientRegistration } from "@mysten/sui/client";
import type { TxThunk } from "./transactions.ts";
import * as queries from "./queries.ts";
import * as transactions from "./transactions.ts";
import * as profileExt from "./extensions/profile.ts";
import * as mediaExt from "./extensions/media.ts";
import type { Media, Party, Profile } from "./types.ts";
import * as partyMod from "./contracts/miso_party/party.ts";
import * as profileMod from "./contracts/party_profile/party_profile.ts";
import * as mediaMod from "./contracts/party_media/party_media.ts";

export interface PartyClientOptions<Name extends string = "party"> {
  /** Name for the client extension. Defaults to "party". */
  name?: Name;
  partyPackageId: string;
  partyProfilePackageId: string;
  countryCodePackageId: string;
  languageCodePackageId: string;
  partyMediaPackageId: string;
}

/** Defaults `options.package` to `pkg` for every call-function in a generated module. */
function bindModulePackage<M extends object>(mod: M, pkg: string): M {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries({ ...mod })) {
    out[key] =
      typeof value === "function"
        ? (options: { package?: string }) => (value as (o: unknown) => unknown)({ package: pkg, ...options })
        : value;
  }
  return out as M;
}

/**
 * Creates the party client extension.
 *
 * @example
 * ```ts
 * const client = new SuiGrpcClient({ network: "testnet" }).$extend(party({
 *   partyPackageId, partyProfilePackageId, countryCodePackageId, languageCodePackageId,
 * }));
 * const profile = await client.party.getProfile("0x...");
 * ```
 */
export function party<const Name extends string = "party">(
  options: PartyClientOptions<Name>,
): SuiClientRegistration<ClientWithCoreApi, Name, PartyClient> {
  const name = (options.name ?? "party") as Name;
  return { name, register: (client) => new PartyClient(client, options) };
}

export class PartyClient {
  #client: ClientWithCoreApi;
  #pkg: string;
  #profilePkg: string;
  #countryCodePkg: string;
  #languageCodePkg: string;
  #mediaPkg: string;

  constructor(client: ClientWithCoreApi, o: Omit<PartyClientOptions, "name">) {
    this.#client = client;
    this.#pkg = o.partyPackageId;
    this.#profilePkg = o.partyProfilePackageId;
    this.#countryCodePkg = o.countryCodePackageId;
    this.#languageCodePkg = o.languageCodePackageId;
    this.#mediaPkg = o.partyMediaPackageId;
  }

  // === Queries ===

  async getPartyById(partyId: string): Promise<Party> {
    return queries.getPartyById(this.#client, partyId);
  }
  derivePartyAdminCapId(partyId: string): string {
    return queries.derivePartyAdminCapId(partyId, this.#pkg);
  }
  async getProfile(partyId: string): Promise<Profile | null> {
    return queries.getProfile(this.#client, partyId, this.#profilePkg);
  }
  async getMedia(partyId: string): Promise<Media | null> {
    return queries.getMedia(this.#client, partyId, this.#mediaPkg);
  }
  /** Group ids a party belongs to (member-side membership records). */
  async getMemberships(partyId: string): Promise<string[]> {
    return queries.getMemberships(this.#client, partyId);
  }
  /** Member ids invited to a group but not yet accepted. */
  async getPendingInvites(groupId: string): Promise<string[]> {
    return queries.getPendingInvites(this.#client, groupId);
  }
  /** Whether a party is a member of a group. */
  async isMember(memberId: string, groupId: string): Promise<boolean> {
    return queries.isMember(this.#client, memberId, groupId, this.#pkg);
  }

  // === Transaction builders (thunks; package ids bound from the client) ===

  get tx() {
    const pkg = this.#pkg;
    const profilePkg = this.#profilePkg;
    const cc = this.#countryCodePkg;
    const lc = this.#languageCodePkg;
    const mediaPkg = this.#mediaPkg;
    return {
      createIndividualParty: (p: Omit<transactions.CreatePartyParams, "partyPackageId">): TxThunk =>
        transactions.createIndividualParty({ ...p, partyPackageId: pkg }),
      createGroupParty: (p: Omit<transactions.CreatePartyParams, "partyPackageId">): TxThunk =>
        transactions.createGroupParty({ ...p, partyPackageId: pkg }),
      setName: (p: Omit<transactions.SetNameParams, "partyPackageId">): TxThunk =>
        transactions.setName({ ...p, partyPackageId: pkg }),
      inviteParty: (p: Omit<transactions.InvitePartyParams, "partyPackageId">): TxThunk =>
        transactions.inviteParty({ ...p, partyPackageId: pkg }),
      acceptInvite: (p: Omit<transactions.AcceptInviteParams, "partyPackageId">): TxThunk =>
        transactions.acceptInvite({ ...p, partyPackageId: pkg }),
      declineInvite: (p: Omit<transactions.DeclineInviteParams, "partyPackageId">): TxThunk =>
        transactions.declineInvite({ ...p, partyPackageId: pkg }),
      revokeInvite: (p: Omit<transactions.RevokeInviteParams, "partyPackageId">): TxThunk =>
        transactions.revokeInvite({ ...p, partyPackageId: pkg }),
      leaveGroup: (p: Omit<transactions.LeaveGroupParams, "partyPackageId">): TxThunk =>
        transactions.leaveGroup({ ...p, partyPackageId: pkg }),
      removeMember: (p: Omit<transactions.RemoveMemberParams, "partyPackageId">): TxThunk =>
        transactions.removeMember({ ...p, partyPackageId: pkg }),
      setProfile: (
        p: Omit<profileExt.SetProfileParams, "partyProfilePackageId" | "countryCodePackageId" | "languageCodePackageId">,
      ): TxThunk =>
        profileExt.setProfile({
          ...p,
          partyProfilePackageId: profilePkg,
          countryCodePackageId: cc,
          languageCodePackageId: lc,
        }),
      clearProfile: (p: Omit<profileExt.ClearProfileParams, "partyProfilePackageId">): TxThunk =>
        profileExt.clearProfile({ ...p, partyProfilePackageId: profilePkg }),
      setMedia: (p: Omit<mediaExt.SetMediaParams, "partyMediaPackageId">): TxThunk =>
        mediaExt.setMedia({ ...p, partyMediaPackageId: mediaPkg }),
      clearMedia: (p: Omit<mediaExt.ClearMediaParams, "partyMediaPackageId">): TxThunk =>
        mediaExt.clearMedia({ ...p, partyMediaPackageId: mediaPkg }),
    };
  }

  // === Generated type-safe Move calls (for tx.add) ===

  get call() {
    return {
      party: bindModulePackage(partyMod, this.#pkg),
      profile: bindModulePackage(profileMod, this.#profilePkg),
      media: bindModulePackage(mediaMod, this.#mediaPkg),
    };
  }

  // === Generated BCS structs (for parsing object/event content) ===

  get bcs() {
    return {
      Party: partyMod.Party,
      PartyAdminCap: partyMod.PartyAdminCap,
      Profile: profileMod.Profile,
      ProfileSetEvent: profileMod.ProfileSetEvent,
      Media: mediaMod.Media,
      MediaSetEvent: mediaMod.MediaSetEvent,
    };
  }
}
