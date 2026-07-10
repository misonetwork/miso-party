// Copyright (c) Miso Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Transaction execution + effect extraction (the Signer-parameter pattern).
// Builders elsewhere only *append* to a caller-owned Transaction; this module is
// where a transaction is actually submitted. Transport-agnostic: takes any
// `ClientWithCoreApi`, so gRPC / JSON-RPC / GraphQL clients all work.

import { Transaction } from "@mysten/sui/transactions";
import type { ClientWithCoreApi, SuiClientTypes } from "@mysten/sui/client";
import type { Signer } from "@mysten/sui/cryptography";
import type { TxThunk } from "./transactions.ts";

/** The effect fields every submit path requests, so extraction is uniform. */
export const FULL_INCLUDE = { effects: true, objectTypes: true, balanceChanges: true } as const;
type FullInclude = typeof FULL_INCLUDE;

export interface ExecResult {
  digest: string;
  changedObjects: SuiClientTypes.ChangedObject[];
  objectTypes: Record<string, string>;
  balanceChanges: SuiClientTypes.BalanceChange[];
  gasUsed: number;
}

/** Builds a fresh Transaction from one or more thunks (awaiting async ones). */
export async function buildTx(...thunks: TxThunk[]): Promise<Transaction> {
  const tx = new Transaction();
  for (const thunk of thunks) await thunk(tx);
  return tx;
}

/** Normalizes the `{ $kind }` transaction-result envelope into an {@link ExecResult}. */
export function toExecResult(res: SuiClientTypes.TransactionResult<FullInclude>): ExecResult {
  if (res.$kind !== "Transaction") {
    const failed = res.FailedTransaction;
    const status = failed.effects?.status;
    const err = status && !status.success ? JSON.stringify(status.error) : "unknown error";
    throw new Error(`Transaction failed: ${err} (digest ${failed.digest})`);
  }

  const t = res.Transaction;
  const effects = t.effects as SuiClientTypes.TransactionEffects;
  if (!effects.status.success) {
    throw new Error(`Transaction reverted: ${JSON.stringify(effects.status.error)} (digest ${t.digest})`);
  }

  return {
    digest: t.digest,
    changedObjects: effects.changedObjects,
    objectTypes: (t.objectTypes as Record<string, string>) ?? {},
    balanceChanges: (t.balanceChanges as SuiClientTypes.BalanceChange[]) ?? [],
    gasUsed: netGas(effects.gasUsed),
  };
}

/** Signs, executes, and waits for a transaction; returns changes, types, gas. */
export async function signAndExecute(client: ClientWithCoreApi, signer: Signer, tx: Transaction): Promise<ExecResult> {
  const res = await client.core.signAndExecuteTransaction({ transaction: tx, signer, include: FULL_INCLUDE });
  const result = toExecResult(res);
  await client.core.waitForTransaction({ digest: result.digest });
  return result;
}

/** Convenience: build from thunks, then sign+execute in one call. */
export async function execThunks(client: ClientWithCoreApi, signer: Signer, ...thunks: TxThunk[]): Promise<ExecResult> {
  return signAndExecute(client, signer, await buildTx(...thunks));
}

/** The first newly-created object whose type contains `substr`. */
export function createdByType(r: ExecResult, substr: string): string {
  for (const c of r.changedObjects) {
    if (c.idOperation === "Created" && (r.objectTypes[c.objectId] ?? "").includes(substr)) return c.objectId;
  }
  throw new Error(`No created object with type containing "${substr}" found in object changes.`);
}

/** All newly-created objects whose type contains `substr`. */
export function allCreatedByType(r: ExecResult, substr: string): { objectId: string; objectType: string }[] {
  const out: { objectId: string; objectType: string }[] = [];
  for (const c of r.changedObjects) {
    const type = r.objectTypes[c.objectId] ?? "";
    if (c.idOperation === "Created" && type.includes(substr)) out.push({ objectId: c.objectId, objectType: type });
  }
  return out;
}

function netGas(gasUsed: SuiClientTypes.GasCostSummary): number {
  return Number(gasUsed.computationCost) + Number(gasUsed.storageCost) - Number(gasUsed.storageRebate);
}
