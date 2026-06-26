#[test_only]
module miso_party::credit_tests;

use miso_party::credit;
use miso_party::test_helpers;
use std::unit_test::assert_eq;

// Error codes from credit.move
const EMaxDisplayNameLengthExceeded: u64 = 30;
const EEmptyString: u64 = 31;
const ENoRoles: u64 = 32;
const EMaxRolesExceeded: u64 = 33;
const EDuplicateRoles: u64 = 40;

// Must match credit.move
const MAX_DISPLAY_NAME_LENGTH: u64 = 200;
const MAX_ROLES: u64 = 50;

/// Test role enum for credit tests.
public enum TestRole has copy, drop, store {
    RoleA,
    RoleB,
    RoleC,
}

// === Happy Path ===

#[test]
fun test_new_valid_credit() {
    let roles = vector[TestRole::RoleA];
    let credit = credit::new(b"John Doe".to_string(), roles);
    assert_eq!(*credit.display_name(), b"John Doe".to_string());
    assert_eq!(credit.roles().length(), 1);
}

#[test]
fun test_new_multiple_roles() {
    let roles = vector[TestRole::RoleA, TestRole::RoleB, TestRole::RoleC];
    let credit = credit::new(b"Jane Smith".to_string(), roles);
    assert_eq!(credit.roles().length(), 3);
}

#[test]
fun test_new_display_name_at_max_length() {
    let name = test_helpers::long_string(MAX_DISPLAY_NAME_LENGTH);
    let roles = vector[TestRole::RoleA];
    let credit = credit::new(name, roles);
    assert_eq!(credit.display_name().length(), MAX_DISPLAY_NAME_LENGTH);
}

// === Error Conditions ===

#[test, expected_failure(abort_code = EEmptyString, location = credit)]
fun test_new_empty_display_name() {
    credit::new(b"".to_string(), vector[TestRole::RoleA]);
}

#[test, expected_failure(abort_code = EMaxDisplayNameLengthExceeded, location = credit)]
fun test_new_display_name_too_long() {
    credit::new(
        test_helpers::long_string(MAX_DISPLAY_NAME_LENGTH + 1),
        vector[TestRole::RoleA],
    );
}

#[test, expected_failure(abort_code = EDuplicateRoles, location = credit)]
fun test_new_duplicate_roles() {
    credit::new(
        b"John Doe".to_string(),
        vector[TestRole::RoleA, TestRole::RoleA],
    );
}

#[test, expected_failure(abort_code = ENoRoles, location = credit)]
fun test_new_no_roles() {
    credit::new<TestRole>(b"John Doe".to_string(), vector[]);
}

#[test]
fun test_new_at_max_roles() {
    // u64 as the role type: 50 distinct values.
    let mut roles = vector[];
    MAX_ROLES.do!(|i| roles.push_back(i));
    let credit = credit::new(b"One Person Band".to_string(), roles);
    assert_eq!(credit.roles().length(), MAX_ROLES);
}

#[test, expected_failure(abort_code = EMaxRolesExceeded, location = credit)]
fun test_new_exceeds_max_roles() {
    let mut roles = vector[];
    (MAX_ROLES + 1).do!(|i| roles.push_back(i));
    credit::new(b"Too Many Hats".to_string(), roles);
}
