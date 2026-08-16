---
name: narl-generate-internal-resolver
description: Generate, wire, and implement a NARL internal action resolver with the internal Plop generator. Use when adding an InternalActionType member, InternalAction union member, internal resolver file, resolver-map entry, or repairing that exact internal-domain contract.
---

# Generate a NARL internal resolver

1. Inspect `plopfile.js`, `plop-templates/action-resolver/internal.ts.hbs`, `src/game/systems/internal/type.ts`, `src/game/systems/internal/resolvers.ts`, and the closest working internal resolver.
2. Run `npm run generate:resolver:internal -- <action-name>`. Supply the domain action name without manually adding `Internal`; the generator normalizes a supplied prefix.
3. Confirm Plop created all wiring: `INTERNAL_<ACTION>` value, `Internal<Name>Action`, `InternalAction` union member, resolver file/import, `internalActionResolvers` entry, and `InternalActionResolver` member.
4. Define the action payload in the generated type, then implement the resolver. Keep state mutations inside the generated IIFE, use domain helpers where available, import global `STATE` when state access is needed, and return `action.resolve(...)`.
5. Compare a working resolver path before adding fallback, message, or next action. Preserve the exact `ActionResolution` shape and root action flow; do not hide a missing contract with UI handling.

## Verify

- Dispatch the generated internal action through the real resolver map and assert the state transition or resolution, including a relevant negative path.
- Check that the action name did not become `InternalInternal<Name>` and that wiring is unique.
- Run focused Vitest, ESLint on changed files, and `git diff --check`.
