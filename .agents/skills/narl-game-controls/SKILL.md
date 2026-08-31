---
name: narl-game-controls
description: Understand and modify NARL keyboard controls, command chains, player actions, and turn-level gameplay behavior. Use for tasks involving input, key bindings, inventory selection, movement, combat commands, action dispatch, or explaining how the playable game works.
---

# NARL Game Controls

Use the repository code as the source of truth. Read [references/controls-and-action-flow.md](references/controls-and-action-flow.md) before analyzing or changing player controls or command behavior.

## Work from the correct layer

- Change root key bindings in `src/game/input/keyboard/create.ts`.
- Implement or change interactive/multi-step keyboard selection in `src/game/input/keyboard/commands/`.
- Treat `src/game/input/keyboard/mapKeyboardEventToAction.ts` and `chain.ts` as the keyboard state-machine contract.
- Change the action payload contract in `src/game/systems/player/types.ts` and keep `src/game/systems/player/resolvers.ts` exhaustive.
- Change gameplay effects in the relevant resolver under `src/game/systems/`; do not put game-state mutation into keyboard commands.
- Keep the visible help in `src/game/render/render.ts` synchronized with root bindings.

## Preserve these invariants

- Map keys with `KeyboardEvent.code` values (`KeyG`, `ArrowLeft`, `Space`), not display characters.
- Keyboard commands produce a `GameAction`, another `KeyboardToAction` map, or `void` for an intermediate multi-step selection.
- A command array represents sequential stages. Every completed chain must eventually return a `GameAction`; otherwise the mapper throws.
- `Escape` cancels the current stage, runs its `cleanup`, and returns to the previous stage when one exists.
- UI highlighting belongs to keyboard command selection; reset it on completion and cancellation.
- Resolver mutations stay inside the resolver IIFE, per `src/game/systems/AGENTS.md`.
- Whether an action advances the world is decided by `Action.resolve(consumesTurn)` and pending resolutions, not by the key mapping.

## Verification

Inspect all touched layers for consistency, then run focused tests if present. Because keyboard mapping currently has no dedicated tests, use `npm run build` as the minimum verification for control changes; add focused Vitest coverage when changing chain/cancellation semantics.
