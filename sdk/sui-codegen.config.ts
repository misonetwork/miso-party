import type { SuiCodegenConfig } from "@mysten/codegen";

// Generates typed BCS structs + Move-call builders under ./src/contracts, one
// folder per Move package. Each entry is a `@local-pkg/<name>` alias plus the
// filesystem path to the package root (containing Move.toml / sources). Move
// dependencies (country_code, language_code, framework, …) are pulled into a
// `deps/` subtree automatically.
const config: SuiCodegenConfig = {
  output: "./src/contracts",
  packages: [
    // Core PartyOS package. From miso-party/sdk, the package root is one up.
    { package: "@local-pkg/miso_party", path: ".." },
    // Extensions (add more as their SDK facades are written).
    { package: "@local-pkg/party_profile", path: "../../miso-party-extensions/party_profile" },
    { package: "@local-pkg/party_media", path: "../../miso-party-extensions/party_media" },
    { package: "@local-pkg/party_roles", path: "../../miso-party-extensions/party_roles" },
    { package: "@local-pkg/party_tags", path: "../../miso-party-extensions/party_tags" },
    { package: "@local-pkg/party_cta", path: "../../miso-party-extensions/party_cta" },
    { package: "@local-pkg/party_genre", path: "../../miso-party-extensions/party_genre" },
    { package: "@local-pkg/party_platform_link", path: "../../miso-party-extensions/party_platform_link" },
    { package: "@local-pkg/party_social", path: "../../miso-party-extensions/party_social" },
    { package: "@local-pkg/party_music", path: "../../miso-party-extensions/party_music" },
    { package: "@local-pkg/party_pro_link", path: "../../miso-party-extensions/party_pro_link" },
    { package: "@local-pkg/party_featured_drop", path: "../../miso-party-extensions/party_featured_drop" },
  ],
};

export default config;
