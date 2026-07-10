// Copyright (c) Miso Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// The `party` client extension for `SuiClient#$extend()`. The caller builds the
// actual client; package ids are passed in here (never hardcoded / read from env).

import type { ClientWithCoreApi, SuiClientRegistration } from "@mysten/sui/client";
import type { TxThunk } from "./transactions.ts";
import * as queries from "./queries.ts";
import * as transactions from "./transactions.ts";
import * as profileExt from "./extensions/profile.ts";
import type { Party, Profile } from "./types.ts";
import * as partyMod from "./contracts/miso_party/party.ts";
import * as profileMod from "./contracts/party_profile/party_profile.ts";

export interface PartyClientOptions<Name extends string = "party"> {
  /** Name for the client extension. Defaults to "party". */
  name?: Name;
  partyPackageId: string;
  partyProfilePackageId: string;
  countryCodePackageId: string;
  languageCodePackageId: string;
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

  constructor(client: ClientWithCoreApi, o: Omit<PartyClientOptions, "name">) {
    this.#client = client;
    this.#pkg = o.partyPackageId;
    this.#profilePkg = o.partyProfilePackageId;
    this.#countryCodePkg = o.countryCodePackageId;
    this.#languageCodePkg = o.languageCodePackageId;
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

  // === Transaction builders (thunks; package ids bound from the client) ===

  get tx() {
    const pkg = this.#pkg;
    const profilePkg = this.#profilePkg;
    const cc = this.#countryCodePkg;
    const lc = this.#languageCodePkg;
    return {
      createIndividualParty: (p: Omit<transactions.CreatePartyParams, "partyPackageId">): TxThunk =>
        transactions.createIndividualParty({ ...p, partyPackageId: pkg }),
      createGroupParty: (p: Omit<transactions.CreatePartyParams, "partyPackageId">): TxThunk =>
        transactions.createGroupParty({ ...p, partyPackageId: pkg }),
      addMember: (p: Omit<transactions.AddMemberParams, "partyPackageId">): TxThunk =>
        transactions.addMember({ ...p, partyPackageId: pkg }),
      setName: (p: Omit<transactions.SetNameParams, "partyPackageId">): TxThunk =>
        transactions.setName({ ...p, partyPackageId: pkg }),
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
    };
  }

  // === Generated type-safe Move calls (for tx.add) ===

  get call() {
    return {
      party: bindModulePackage(partyMod, this.#pkg),
      profile: bindModulePackage(profileMod, this.#profilePkg),
    };
  }

  // === Generated BCS structs (for parsing object/event content) ===

  get bcs() {
    return {
      Party: partyMod.Party,
      PartyAdminCap: partyMod.PartyAdminCap,
      Profile: profileMod.Profile,
      ProfileSetEvent: profileMod.ProfileSetEvent,
    };
  }
}
