---
name: narl-generate-player-resolver
description: Generate, wire, and implement a NARL player action resolver with the player Plop generator. Use when adding a PlayerActionType member, PlayerAction union member, player resolver file or map entry, or when a new player command needs its generated action/resolver contract.
---

# Generate a NARL player resolver

1. Inspect `plopfile.js`, `plop-templates/action-resolver/player.ts.hbs`, `src/game/systems/player/types.ts`, `src/game/systems/player/resolvers.ts`, the closest working resolver, and the keyboard command path when input triggers the action.
2. Run `npm run generate:resolver:player -- <action-name>`. Supply the action name without manually adding `Player`; the generator normalizes a supplied prefix.
3. Confirm Plop created all wiring: `PLAYER_<ACTION>` value, `Player<Name>Action`, `PlayerAction` union member, resolver file/import, and `playerActionResolvers` entry.
4. Define the payload in the generated action type, then implement the resolver. Keep state mutations inside the generated IIFE, prefer domain helpers, import global `STATE` when needed, and return `action.resolve(...)`.
5. Wire keyboard commands separately when requested; the generator does not modify keyboard mappings or command chains. Preserve command-chain fallback/message/next shapes and ensure the emitted root action matches the generated player action.

## Verify

- Exercise the named keyboard interaction through dispatch and the resolver, plus cancellation or invalid-input paths. Startup alone is not proof.
- Check that the action name did not become `PlayerPlayer<Name>` and that wiring is unique.
- Run focused Vitest, ESLint on changed files, and `git diff --check`.
