/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * The one pressing a party wants to headline — the "featured release" slot on a
 * profile.
 * 
 * A party's full discography is _derived_ (an indexer lists every pressing the
 * party minted), but which one to feature is a **choice the artist authors** — it
 * exists nowhere on-chain until declared, so it can't be derived and must be
 * stored. This extension stores it.
 * 
 * Unlike the other party extensions, this one takes a protocol dependency
 * (`miso_pressing`) on purpose. `set_featured` requires the live
 * `Pressing<Currency>` object, so the featured id is _proven_ to be a real
 * pressing at write time — no garbage or dangling ids can be pinned. A `Pressing`
 * is a shared, `key`-only, currency-generic object, so it can't be held on the
 * party; we store only its `ID`. The pressing's live state (price, edition,
 * sold-out, its release) is read from the object by id at render time and never
 * copied here.
 * 
 * One slot, replace-in-place: `set_featured` overwrites any existing pin. Gated by
 * the `PartyAdminCap`; views are permissionless.
 */

import { MoveTuple, MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
const $moduleName = '@local-pkg/party_featured_pressing::party_featured_pressing';
export const FeaturedKey = new MoveTuple({ name: `${$moduleName}::FeaturedKey`, fields: [bcs.bool()] });
export const FeaturedSetEvent = new MoveStruct({ name: `${$moduleName}::FeaturedSetEvent`, fields: {
        party_id: bcs.Address,
        pressing_id: bcs.Address
    } });
export const FeaturedClearedEvent = new MoveStruct({ name: `${$moduleName}::FeaturedClearedEvent`, fields: {
        party_id: bcs.Address
    } });
export interface SetFeaturedArguments {
    self: RawTransactionArgument<string>;
    cap: RawTransactionArgument<string>;
    pressing: RawTransactionArgument<string>;
}
export interface SetFeaturedOptions {
    package?: string;
    arguments: SetFeaturedArguments | [
        self: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>,
        pressing: RawTransactionArgument<string>
    ];
    typeArguments: [
        string
    ];
}
/**
 * Feature `pressing` on the party, replacing any existing pin. Takes the live
 * `Pressing` object so the stored id is guaranteed to be a real pressing; only its
 * id is kept.
 */
export function setFeatured(options: SetFeaturedOptions) {
    const packageAddress = options.package ?? '@local-pkg/party_featured_pressing';
    const argumentsTypes = [
        null,
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self", "cap", "pressing"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party_featured_pressing',
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
/** Removes the party's featured pressing. No-op if none is set. */
export function clearFeatured(options: ClearFeaturedOptions) {
    const packageAddress = options.package ?? '@local-pkg/party_featured_pressing';
    const argumentsTypes = [
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self", "cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party_featured_pressing',
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
/** Whether the party has a featured pressing. */
export function hasFeatured(options: HasFeaturedOptions) {
    const packageAddress = options.package ?? '@local-pkg/party_featured_pressing';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party_featured_pressing',
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
/** The party's featured pressing id, or `none` if unset. */
export function featured(options: FeaturedOptions) {
    const packageAddress = options.package ?? '@local-pkg/party_featured_pressing';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party_featured_pressing',
        function: 'featured',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}