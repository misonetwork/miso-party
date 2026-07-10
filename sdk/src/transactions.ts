// Copyright (c) Miso Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Core PartyOS transaction builders. Every builder returns a thunk that *appends*
// commands to a caller-owned Transaction, so flows compose. Package ids are taken
// in params (the client binds them; see ./client.ts). Calls into the party package
// go through the generated typed call fns (party.*).

import type { Transaction } from "@mysten/sui/transactions";
import * as party from "./contracts/miso_party/party.ts";

export type TxThunk = (tx: Transaction) => void | Promise<void>;

export interface CreatePartyParams {
  /** Human-readable party name (not verified; app-layer verifies). */
  name: string;
  /** Address that receives the PartyAdminCap. */
  recipient: string;
  partyPackageId: string;
}

/** Creates an individual party, shares it, and transfers its admin cap to `recipient`. */
export function createIndividualParty(params: CreatePartyParams): TxThunk {
  return (tx) => {
    const kind = tx.add(party.newIndividualKind({ package: params.partyPackageId }));
    const res = tx.add(party._new({ package: params.partyPackageId, arguments: [kind, params.name] }));
    tx.add(party.share({ package: params.partyPackageId, arguments: [res[0]!, res[1]!] }));
    tx.transferObjects([res[1]!], params.recipient);
  };
}

/** Creates a group party (empty member set), shares it, transfers its admin cap. */
export function createGroupParty(params: CreatePartyParams): TxThunk {
  return (tx) => {
    const kind = tx.add(party.newGroupKind({ package: params.partyPackageId }));
    const res = tx.add(party._new({ package: params.partyPackageId, arguments: [kind, params.name] }));
    tx.add(party.share({ package: params.partyPackageId, arguments: [res[0]!, res[1]!] }));
    tx.transferObjects([res[1]!], params.recipient);
  };
}

export interface AddMemberParams {
  groupId: string;
  groupCapId: string;
  /** The individual party's (shared) object id to add. */
  memberId: string;
  partyPackageId: string;
}

/** Adds an individual party to a group (gated by the group's admin cap). */
export function addMember(params: AddMemberParams): TxThunk {
  return (tx) => {
    tx.add(party.addParty({
      package: params.partyPackageId,
      arguments: [params.groupId, params.groupCapId, params.memberId],
    }));
  };
}

export interface SetNameParams {
  partyId: string;
  capId: string;
  name: string;
  partyPackageId: string;
}

/** Sets the party's human-readable name. */
export function setName(params: SetNameParams): TxThunk {
  return (tx) => {
    tx.add(party.setName({
      package: params.partyPackageId,
      arguments: [params.partyId, params.capId, params.name],
    }));
  };
}
