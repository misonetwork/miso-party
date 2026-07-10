/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * Represents parties (individuals or groups) that participate in on-chain
 * activities. A party is a named entity with capability-based authorization.
 * 
 * ### Key Features:
 * 
 * - Individual and group party types
 * - Extensible metadata via dynamic fields
 * - Capability-based authorization for modifications
 * - Groups can contain multiple individual parties
 */

import { MoveEnum, MoveStruct, MoveTuple, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction, type TransactionArgument } from '@mysten/sui/transactions';
import * as vec_set from './deps/sui/vec_set.js';
const $moduleName = '@local-pkg/miso_party::party';
/** The type of self: individual person or group. */
export const PartyKind = new MoveEnum({ name: `${$moduleName}::PartyKind`, fields: {
        /** A single person (artist, producer, etc.). */
        Individual: null,
        /** A group containing multiple individual parties. */
        Group: vec_set.VecSet(bcs.Address)
    } });
export const Party = new MoveStruct({ name: `${$moduleName}::Party`, fields: {
        /** Unique identifier for this party. */
        id: bcs.Address,
        /** Whether this is an individual or group party. */
        kind: PartyKind,
        /**
         * Human-readable name of the party. Note this name is not "official" or "verified"
         * in any way. Verification should be performed by the application layer.
         */
        name: bcs.string()
    } });
export const PartyAdminCap = new MoveStruct({ name: `${$moduleName}::PartyAdminCap`, fields: {
        /** Unique identifier for this capability. */
        id: bcs.Address,
        /** ID of the party this capability controls. */
        party_id: bcs.Address
    } });
export const PartyAdminCapKey = new MoveTuple({ name: `${$moduleName}::PartyAdminCapKey`, fields: [bcs.Address] });
export const PartyCreatedEvent = new MoveStruct({ name: `${$moduleName}::PartyCreatedEvent`, fields: {
        /** ID of the newly created party. */
        party_id: bcs.Address,
        /** Name of the party. */
        name: bcs.string(),
        /** Kind of the party. */
        kind: bcs.string()
    } });
export const PartyNameSetEvent = new MoveStruct({ name: `${$moduleName}::PartyNameSetEvent`, fields: {
        /** ID of the party. */
        party_id: bcs.Address,
        /** Name of the party. */
        name: bcs.string()
    } });
export const PartyAddedToGroupEvent = new MoveStruct({ name: `${$moduleName}::PartyAddedToGroupEvent`, fields: {
        /** ID of the group. */
        group_id: bcs.Address,
        /** ID of the party added to the group. */
        member_id: bcs.Address
    } });
export const PartyRemovedFromGroupEvent = new MoveStruct({ name: `${$moduleName}::PartyRemovedFromGroupEvent`, fields: {
        /** ID of the group. */
        group_id: bcs.Address,
        /** ID of the party removed from the group. */
        member_id: bcs.Address
    } });
export const PartyLeftGroupEvent = new MoveStruct({ name: `${$moduleName}::PartyLeftGroupEvent`, fields: {
        /** ID of the group. */
        group_id: bcs.Address,
        /** ID of the party that left the group. */
        member_id: bcs.Address
    } });
export interface NewArguments {
    kind: TransactionArgument;
    name: RawTransactionArgument<string>;
}
export interface NewOptions {
    package?: string;
    arguments: NewArguments | [
        kind: TransactionArgument,
        name: RawTransactionArgument<string>
    ];
}
/**
 * Creates a new party with the specified kind and name. Returns the admin
 * capability for managing the party. The party is shared and starts in the Created
 * state.
 */
export function _new(options: NewOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["kind", "name"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'new',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ShareArguments {
    self: RawTransactionArgument<string>;
    cap: RawTransactionArgument<string>;
}
export interface ShareOptions {
    package?: string;
    arguments: ShareArguments | [
        self: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>
    ];
}
/**
 * Shares the party object, making it publicly accessible. Requires the admin
 * capability.
 */
export function share(options: ShareOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self", "cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'share',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface SetNameArguments {
    self: RawTransactionArgument<string>;
    cap: RawTransactionArgument<string>;
    name: RawTransactionArgument<string>;
}
export interface SetNameOptions {
    package?: string;
    arguments: SetNameArguments | [
        self: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>,
        name: RawTransactionArgument<string>
    ];
}
/** Sets the human-readable name of the party. Requires the admin capability. */
export function setName(options: SetNameOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null,
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["self", "cap", "name"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'set_name',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddPartyArguments {
    self: RawTransactionArgument<string>;
    cap: RawTransactionArgument<string>;
    member: RawTransactionArgument<string>;
}
export interface AddPartyOptions {
    package?: string;
    arguments: AddPartyArguments | [
        self: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>,
        member: RawTransactionArgument<string>
    ];
}
/**
 * Adds an individual party to a group. Requires the admin capability for the
 * group. The party being added must be an individual (not another group).
 */
export function addParty(options: AddPartyOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null,
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self", "cap", "member"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'add_party',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface RemovePartyArguments {
    self: RawTransactionArgument<string>;
    cap: RawTransactionArgument<string>;
    memberId: RawTransactionArgument<string>;
}
export interface RemovePartyOptions {
    package?: string;
    arguments: RemovePartyArguments | [
        self: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>,
        memberId: RawTransactionArgument<string>
    ];
}
/**
 * Removes a party from a group by their ID. Requires the admin capability for the
 * group.
 */
export function removeParty(options: RemovePartyOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null,
        null,
        '0x2::object::ID'
    ] satisfies (string | null)[];
    const parameterNames = ["self", "cap", "memberId"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'remove_party',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface LeaveArguments {
    group: RawTransactionArgument<string>;
    memberCap: RawTransactionArgument<string>;
}
export interface LeaveOptions {
    package?: string;
    arguments: LeaveArguments | [
        group: RawTransactionArgument<string>,
        memberCap: RawTransactionArgument<string>
    ];
}
/**
 * Removes the caller's party from a group, authorized by the _member's_ own admin
 * capability. Group membership is added unilaterally by the group's admin, but no
 * party can be kept in a group against its will — this is the member's
 * unconditional exit.
 */
export function leave(options: LeaveOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["group", "memberCap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'leave',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NewIndividualKindOptions {
    package?: string;
    arguments?: [
    ];
}
/** Creates a new individual party kind. */
export function newIndividualKind(options: NewIndividualKindOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'new_individual_kind',
    });
}
export interface NewGroupKindOptions {
    package?: string;
    arguments?: [
    ];
}
/** Creates a new group party kind with an empty member set. */
export function newGroupKind(options: NewGroupKindOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'new_group_kind',
    });
}
export interface IdArguments {
    self: RawTransactionArgument<string>;
}
export interface IdOptions {
    package?: string;
    arguments: IdArguments | [
        self: RawTransactionArgument<string>
    ];
}
/** Returns the ID of this party. */
export function id(options: IdOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NameArguments {
    self: RawTransactionArgument<string>;
}
export interface NameOptions {
    package?: string;
    arguments: NameArguments | [
        self: RawTransactionArgument<string>
    ];
}
/** Returns the human-readable name of this party. */
export function name(options: NameOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'name',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface IsIndividualKindArguments {
    self: RawTransactionArgument<string>;
}
export interface IsIndividualKindOptions {
    package?: string;
    arguments: IsIndividualKindArguments | [
        self: RawTransactionArgument<string>
    ];
}
/** Returns true if this party is an individual. */
export function isIndividualKind(options: IsIndividualKindOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'is_individual_kind',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface IsGroupKindArguments {
    self: RawTransactionArgument<string>;
}
export interface IsGroupKindOptions {
    package?: string;
    arguments: IsGroupKindArguments | [
        self: RawTransactionArgument<string>
    ];
}
/** Returns true if this party is a group. */
export function isGroupKind(options: IsGroupKindOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'is_group_kind',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GroupMembersArguments {
    self: RawTransactionArgument<string>;
}
export interface GroupMembersOptions {
    package?: string;
    arguments: GroupMembersArguments | [
        self: RawTransactionArgument<string>
    ];
}
/** Returns a reference to the group members. Aborts if this party is not a group. */
export function groupMembers(options: GroupMembersOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'group_members',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface PartyKindNameArguments {
    self: TransactionArgument;
}
export interface PartyKindNameOptions {
    package?: string;
    arguments: PartyKindNameArguments | [
        self: TransactionArgument
    ];
}
/** Returns the human-readable name of the party kind. */
export function partyKindName(options: PartyKindNameOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'party_kind_name',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AuthorizeArguments {
    self: RawTransactionArgument<string>;
    cap: RawTransactionArgument<string>;
}
export interface AuthorizeOptions {
    package?: string;
    arguments: AuthorizeArguments | [
        self: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>
    ];
}
/** Verifies that the admin capability matches this party. */
export function authorize(options: AuthorizeOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self", "cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'authorize',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface PartyAdminCapPartyIdArguments {
    cap: RawTransactionArgument<string>;
}
export interface PartyAdminCapPartyIdOptions {
    package?: string;
    arguments: PartyAdminCapPartyIdArguments | [
        cap: RawTransactionArgument<string>
    ];
}
/** Returns the ID of the party associated with the admin capability. */
export function partyAdminCapPartyId(options: PartyAdminCapPartyIdOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'party_admin_cap_party_id',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UidArguments {
    self: RawTransactionArgument<string>;
}
export interface UidOptions {
    package?: string;
    arguments: UidArguments | [
        self: RawTransactionArgument<string>
    ];
}
/** Returns a reference to the party's UID for reading dynamic fields. */
export function uid(options: UidOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'uid',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UidMutArguments {
    self: RawTransactionArgument<string>;
    cap: RawTransactionArgument<string>;
}
export interface UidMutOptions {
    package?: string;
    arguments: UidMutArguments | [
        self: RawTransactionArgument<string>,
        cap: RawTransactionArgument<string>
    ];
}
/**
 * Returns a mutable reference to the party's UID for dynamic field operations.
 * Requires the admin capability.
 */
export function uidMut(options: UidMutOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null,
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self", "cap"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'uid_mut',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AssertIsIndividualKindArguments {
    self: RawTransactionArgument<string>;
}
export interface AssertIsIndividualKindOptions {
    package?: string;
    arguments: AssertIsIndividualKindArguments | [
        self: RawTransactionArgument<string>
    ];
}
/** Aborts if this party is not an individual. */
export function assertIsIndividualKind(options: AssertIsIndividualKindOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'assert_is_individual_kind',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AssertIsGroupKindArguments {
    self: RawTransactionArgument<string>;
}
export interface AssertIsGroupKindOptions {
    package?: string;
    arguments: AssertIsGroupKindArguments | [
        self: RawTransactionArgument<string>
    ];
}
/** Aborts if this party is not a group. */
export function assertIsGroupKind(options: AssertIsGroupKindOptions) {
    const packageAddress = options.package ?? '@local-pkg/miso_party';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["self"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'party',
        function: 'assert_is_group_kind',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}