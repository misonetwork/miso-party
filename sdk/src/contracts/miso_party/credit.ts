/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * Represents a party's credit on a work or activity. A credit pairs a display name
 * with one or more roles, identifying how a party contributed to the work.
 */

import { type BcsType, bcs } from '@mysten/sui/bcs';
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { type Transaction, type TransactionArgument } from '@mysten/sui/transactions';
const $moduleName = '@local-pkg/miso_party::credit';
/**
 * A credit attributing roles to a party on a work. Generic over the role type to
 * support domain-specific roles.
 */
export function Credit<Role extends BcsType<any>>(...typeParameters: [
    Role
]) {
    return new MoveStruct({ name: `${$moduleName}::Credit<${typeParameters[0].name as Role['name']}>`, fields: {
            /** Human-readable name to display for this credit. */
            display_name: bcs.string(),
            /** Roles assigned to the credited party. */
            roles: bcs.vector(typeParameters[0])
        } });
}
export interface NewArguments {
    displayName: RawTransactionArgument<string>;
    roles: TransactionArgument;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        displayName: RawTransactionArgument<string>,
        roles: TransactionArgument
    ];
    typeArguments: [
        string
    ];
}
/**
 * Creates a new credit with the given display name and roles. Requires 1 to
 * `MAX_ROLES` roles; aborts with `EDuplicateRoles` if roles contains duplicates.
 */
export function _new(options: NewOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        '0x1::string::String',
        `vector<${options.typeArguments[0]}>`
    ] satisfies (string | null)[];
    const parameterNames = ["displayName", "roles"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'credit',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface DisplayNameArguments {
    self: TransactionArgument;
}
export interface DisplayNameOptions {
    package?: string;
    arguments: DisplayNameArguments | [
        self: TransactionArgument
    ];
    typeArguments: [
        string
    ];
}
/** Returns the display name for this credit. */
export function displayName(options: DisplayNameOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'credit',
        function: 'display_name',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}
export interface RolesArguments {
    self: TransactionArgument;
}
export interface RolesOptions {
    package?: string;
    arguments: RolesArguments | [
        self: TransactionArgument
    ];
    typeArguments: [
        string
    ];
}
/** Returns a reference to the roles assigned in this credit. */
export function roles(options: RolesOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'credit',
        function: 'roles',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
        typeArguments: options.typeArguments
    });
}