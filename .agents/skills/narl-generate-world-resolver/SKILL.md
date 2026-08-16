---
name: narl-generate-world-resolver
description: Generate, wire, and implement a NARL world action resolver with the world Plop generator. Use when adding a WorldActionType member, WorldAction union member, world resolver file or map entry, or repairing the WORLD_ value-prefix and world-domain resolution contract.
---

# Generate a NARL world resolver

1. Inspect `plopfile.js`, `plop-templates/action-resolver/world.ts.hbs`, `src/game/systems/world/types.ts`, `src/game/systems/world/resolvers.ts`, and the closest working world resolver.
2. Run `npm run generate:resolver:world -- <action-name>`. Supply the action name without manually adding `World`; the generator normalizes a supplied prefix.
3. Confirm Plop created all wiring: symbolic key `<ACTION>`, string value `WORLD_<ACTION>`, `World<Name>Action`, `WorldAction` union member, resolver file/import, and `worldActionResolvers` entry. Keep the key stable and the prefix on the string value.
4. Define the action payload in the generated type, then implement the deterministic transition. Keep state mutations inside the generated IIFE, prefer world-domain helpers, import global `STATE` when needed, and return `action.resolve(...)`.
5. Preserve exact identifiers carried across delayed or cleanup actions. Compare the working action chain before setting fallback, message, or next action, and keep the emitted root action shape exact.

## Verify

- Dispatch the world action through the real map and assert the transition, chained next action when present, and a relevant negative path.
- Check for `WORLD_<ACTION>`, prevent `WorldWorld<Name>`, and confirm all wiring is unique.
- Run focused Vitest, ESLint on changed files, and `git diff --check`.
