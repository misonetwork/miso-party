/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * The one drop a party wants to headline — the "featured release" slot on a
 * profile.
 * 
 * A party's full discography is _derived_ (an indexer lists every drop the party
 * minted), but which one to feature is a **choice the artist authors** — it exists
 * nowhere on-chain until declared, so it can't be derived and must be stored. This
 * extension stores it.
 * 
 * Unlike the other party extensions, this one takes a protocol dependency
 * (`miso_drop`) on purpose. `set_featured` requires the live `Drop<Currency>`
 * object, so the featured id is _proven_ to be a real drop at write time — no
 * garbage or dangling ids can be pinned. A `Drop` is a shared, `key`-only,
 * currency-generic object, so it can't be held on the party; we store only its
 * `ID`. The drop's live state (price, edition, sold-out, its release) is read from
 * the object by id at render time and never copied here.
 * 
 * One slot, replace-in-place: `set_featured` overwrites any existing pin. Gated by
 * the `PartyAdminCap`; views are permissionless.
 */

import { MoveTuple, MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
const $moduleName = '@local-pkg/party_featured_drop::party_featured_drop';
export const FeaturedKey = new MoveTuple({ name: `${$moduleName}::FeaturedKey`, fields: [bcs.bool()] });
export const FeaturedSetEvent = new MoveStruct({ name: `${$moduleName}::FeaturedSetEvent`, fields: {
        party_id: bcs.Address,
        drop_id: bcs.Address
    } });
export const FeaturedClearedEvent = new MoveStruct({ name: `${$moduleName}::FeaturedClearedEvent`, fields: {
        party_id: bcs.Address
    } });
export interface SetFeaturedArguments {
    self: RawTransactionArgument<string>;
    cap: RawTransactionArgument<string>;
    drop: RawTransactionArgument<string>;
}
export interface SetFeaturedOptions {
    package?: string;
    arguments: SetFeaturedArguments | [
        self: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>,
        drop: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Feature `drop` on the party, replacing any existing pin. Takes the live `Drop`
 * object so the stored id is guaranteed to be a real drop; only its id is kept.
 */
export function setFeatured(options: SetFeaturedOptions) {
    const packageAddress = options.package ?? '@local-pkg/party_featured_drop';
    const argumentsTypes = [
        null,
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self", "cap", "drop"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party_featured_drop',
        function: 'set_featured',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface ClearFeaturedArguments {
    self: RawTransactionArgument<string>;
    cap: RawTransactionArgument<string>;
}
export interface ClearFeaturedOptions {
    package?: string;
    arguments: ClearFeaturedArguments | [
        self: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>
    ];
}
/** Removes the party's featured drop. No-op if none is set. */
export function clearFeatured(options: ClearFeaturedOptions) {
    const packageAddress = options.package ?? '@local-pkg/party_featured_drop';
    const argumentsTypes = [
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self", "cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party_featured_drop',
        function: 'clear_featured',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface HasFeaturedArguments {
    self: RawTransactionArgument<string>;
}
export interface HasFeaturedOptions {
    package?: string;
    arguments: HasFeaturedArguments | [
        self: RawTransactionArgument<string>
    ];
}
/** Whether the party has a featured drop. */
export function hasFeatured(options: HasFeaturedOptions) {
    const packageAddress = options.package ?? '@local-pkg/party_featured_drop';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party_featured_drop',
        function: 'has_featured',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface FeaturedArguments {
    self: RawTransactionArgument<string>;
}
export interface FeaturedOptions {
    package?: string;
    arguments: FeaturedArguments | [
        self: RawTransactionArgument<string>
    ];
}
/** The party's featured drop id, or `none` if unset. */
export function featured(options: FeaturedOptions) {
    const packageAddress = options.package ?? '@local-pkg/party_featured_drop';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party_featured_drop',
        function: 'featured',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}