# partyos

[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Move](https://img.shields.io/badge/Move-2024-black.svg)](https://docs.sui.io/concepts/sui-move-concepts)

> On-chain party identity and credits for [Sui](https://sui.io).

`partyos` provides two reusable primitives for any protocol that needs to attribute work to people or organizations:

- **`Party`** — a named, capability-authorized identity that can represent an **individual** or a **group** of parties. Parties are extensible (other packages can attach data via dynamic fields) and own their lifecycle through a `PartyAdminCap`.
- **`Credit<Role>`** — a generic attribution pairing a display name with one or more roles, parameterized over a domain-specific role type so each protocol defines its own roles.

## Concepts

### Party

```move
let (party, cap) = party::new(party::new_individual_kind(), b"Ada".to_string(), ctx);
party.share(&cap); // make it a shared object
```

- Individual or group (`new_individual_kind()` / `new_group_kind()`); groups hold member party IDs.
- All mutations (`set_name`, `add_party`, `remove_party`) require the `PartyAdminCap`.
- Extensible: holders of the cap can reach the party's `&mut UID` (`uid_mut`) to attach domain data.

### Credit

```move
let credit = credit::new(b"Producer".to_string(), vector[my_role]);
```

`Credit<Role>` is `copy + drop + store` and generic over `Role: copy + drop + store`, so a music protocol can use a `RecordingRole`, a film protocol a `FilmRole`, etc., while sharing one attribution type.

## Install

```toml
[dependencies]
partyos = { git = "https://github.com/misonetwork/partyos.git", rev = "main" }
```

## Build & test

```sh
sui move build
sui move test
```

## Contributing

Issues and pull requests are welcome. By contributing you agree that your contributions are licensed under the project's Apache 2.0 license.

## License

[Apache 2.0](LICENSE) © Miso Labs, Inc.
