# Controls and action flow

This is a navigation aid, not a substitute for checking changed code. The canonical binding map is `src/game/input/keyboard/create.ts`.

## Current root controls

| Input | Command | Result |
| --- | --- | --- |
| `ArrowLeft` / `ArrowRight` | Move | Moves one world position. Moving into a mob queues `PLAYER_ATTACK`; reaching the end gate queues win. |
| `G` (`KeyG`) | Pick up / unpack | Picks up the floor item. A non-cursed container is unpacked first; cursed containers cannot be opened. |
| `I` (`KeyI`) | Inspect | Opens inventory selection. Arrow keys move the highlight, `Tab` switches inventory/equipment, and `Space` confirms. Inspecting does not consume a turn. |
| `E` (`KeyE`) | Equip | Select an inventory slot with arrows, confirm with `Space`. |
| `U` (`KeyU`) | Unequip | Select an equipment slot with arrows, confirm with `Space`. |
| `M` (`KeyM`) | Move item | Two-stage chain: select a source inventory slot, then a target container slot; confirm each with `Space`. |
| `D` (`KeyD`) | Drop | Select an inventory slot with arrows and confirm with `Space`; the item is dropped at the player position. |
| `P` (`KeyP`) | Poke | Then choose `ArrowLeft` or `ArrowRight`; targets the adjacent world position. |
| `W` (`KeyW`) | Wait | Spends a turn and queues healing for 4–5 HP using the player's RNG. |
| `Escape` | Cancel | Only while a command chain is active. Cancels the current step, cleans its UI state, and returns one stage or exits. |

The on-screen summary is hardcoded in `src/game/render/render.ts`; update it whenever root bindings change.

## Exact command behavior

### Move — `ArrowLeft` / `ArrowRight`

- Creates `PLAYER_MOVE` with `Direction.LEFT` or `Direction.RIGHT`.
- Resolves the adjacent position with `getNextPosition`. A world-boundary failure logs `Cannot move ...` and does not consume a turn.
- If the destination contains a mob, the player does not move. The resolver immediately queues `PLAYER_ATTACK` against that tile.
- If the destination is `ENG_GAME_GATE_POSITION`, it queues `WORLD_WIN` instead of moving.
- Otherwise it discovers nearby tiles, updates both the player's `PositionComponent` and `STATE.player.position`, awards exploration EXP based on the destination floor, marks the position visited, and consumes a turn.
- Source: `src/game/systems/movement/resolvePlayerMoveAction.ts`.

### Pick up / unpack — `G`

- Creates `PLAYER_PICK_UP_UNPACK`; the actual pickup is delegated to an immediate `PLAYER_PICK_UP` action.
- Only the player's current tile is considered. `pickUpItem(tile)` selects `tile.items.at(-1)`, so this operates on the last/topmost floor item.
- Fails without consuming a turn when there is no item or the backpack is full.
- A normal item or cursed container is picked up directly. A non-cursed container is first unpacked: its contents and the container itself replace it on the floor, then the new last/topmost item is picked up.
- The actual pickup also requires a backpack, free capacity, and `PickupableComponent`. It moves the item into the first empty backpack slot and removes it from the tile.
- Picking up may immediately curse an item whose manual says `shouldBeCursed`; this adds `CursedComponent`, cursed color, and runs the manual's curse hook.
- Successful pickup consumes a turn. Failures do not.
- Sources: `src/game/systems/pickUp/resolvePickUpUnpack.ts`, `resolvePickUpAction.ts`, and `src/game/model/queries/pickUp.ts`.

### Inspect — `I`

- Starts in the backpack grid. Arrow keys move only to adjacent valid slots; `Space` confirms the highlighted slot.
- `Tab` switches between backpack and equipment. At the inventory/equipment link points, `ArrowUp` and `ArrowDown` also cross grids and seed the linked highlight.
- Confirming a backpack slot creates `PLAYER_INSPECT_INV`; confirming equipment creates `PLAYER_INSPECT_EQ`.
- An occupied slot increments the item's inspected counter, logs its generated inspection text, and may trigger its first curse.
- An empty backpack slot logs `No item to inspect`. An empty equipment slot logs the slot description or `<slot> slot is empty`.
- Inspect explicitly does not consume a turn, including when it triggers `WORLD_CURSE` (that resolver only mutates/logs and also does not consume a turn).
- Sources: `src/game/input/keyboard/commands/inspectCommand.ts` and `src/game/systems/inspect/resolveInspect*Action.ts`.

### Equip — `E`

- Opens backpack selection; arrows move the highlight and `Space` creates `PLAYER_EQUIP_ITEM` for the selected inventory slot.
- Fails without consuming a turn for an empty slot, an item with no compatible equipment component, a disabled slot that does not explicitly accept the item, or an already occupied compatible slot.
- An equippable item may declare only one equipment-slot component; more than one is treated as a programming error.
- Success moves the item from the backpack to the first matching equipment slot, logs the equipped item, may trigger its curse, and consumes a turn.
- Source: `src/game/systems/eq/resolveEquipAction.ts`.

### Unequip — `U`

- Opens the equipment grid; arrows move the highlight and `Space` creates `PLAYER_UNEQUIP_ITEM` for the selected slot.
- Fails without consuming a turn when the equipment slot is empty or the item lacks removable semantics.
- With backpack space, moves the item into the first empty backpack slot and consumes a turn.
- With a full backpack, immediately queues `PLAYER_DROP_ITEM` with reason `BACKPACK_FULL`; the equipped item is dropped at the player's current world position and the resulting drop consumes the turn.
- Source: `src/game/systems/eq/resolveUnequipAction.ts`.

### Move item into container — `M`

- This is a two-stage selection over the backpack grid: choose a source item, confirm with `Space`, then choose a target item and confirm again.
- The second selection identifies a destination **item/container**, not a destination slot inside it. `addItemToContainer` places the source in that container's first empty slot.
- Fails without consuming a turn if either selected backpack slot is empty, source and target are the same item, target is not a container, target is full, or nesting the source container would exceed the target's maximum nesting depth.
- There is no swap behavior.
- Success detaches the source from the backpack, inserts it into the target container, and consumes a turn.
- Source: `src/game/systems/moveItem/resolveMoveItemAction.ts`.

### Drop — `D`

- Opens backpack selection; arrows move the highlight and `Space` creates `PLAYER_DROP_ITEM` with manual reason and the player's current position.
- An empty selected slot fails without consuming a turn.
- Success detaches the item from its container, places it in the current tile's `items`, assigns the world position, logs the item name, and consumes a turn.
- The current player-drop resolver does not call `isDroppable`; document or change actual resolver behavior rather than assuming `DroppableComponent` is enforced.
- The same resolver also handles automatic dropping from equipment after an unequip attempt with a full backpack.
- Sources: `src/game/input/keyboard/commands/dropCommand.ts`, `src/game/systems/drop/resolvePlayerDropItemAction.ts`, and `drop.ts`.

### Poke — `P`, then left/right

- `P` starts a direction subcommand; `ArrowLeft`/`ArrowRight` creates `PLAYER_POKE` for the adjacent world position. It never moves the player.
- Out-of-world targets, empty tiles, or a missing mob fail with `Nothing to poke` and do not consume a turn.
- If the mob manual defines `poke`, that hook fully decides the action's effects/logging/turn consumption through the shared `Action` object.
- Without a custom hook, it logs `Poked <mob>` and consumes a turn.
- Poke is also the unarmed fallback of `PLAYER_ATTACK`.
- Source: `src/game/systems/poke/resolvePokeAction.ts`.

### Wait — `W`

- Creates `PLAYER_WAIT`.
- Draws `4..5` from the player's RNG, immediately queues `WORLD_HEAL`, and caps the resulting HP at max HP.
- Always consumes a turn, even when the player is already at max HP.
- Sources: `src/game/systems/wait/resolvePlayerWaitAction.ts` and `src/game/systems/heal/resolveWorldHealAction.ts`.

### Implicit attack — move into a mob

- There is no separate root attack key. Attempting to move into a mob queues `PLAYER_ATTACK` for that tile.
- With an attack weapon, `hit()` applies damage. Zero damage logs a tingle; positive damage logs the amount. Lethal damage queues `WORLD_KILL`; a survivor's `onAfterTakeDamage` hook runs.
- Without an attack weapon, attack queues `PLAYER_POKE` instead.
- If the target tile no longer contains a mob, attack becomes a no-op and does not consume a turn.
- Source: `src/game/systems/attack/resolvePlayerAttackAction.ts`.

### Cancel / invalid input

- `Escape` has meaning only during an active command chain. It runs the current stage's cleanup, then returns to the preceding stage or exits the chain.
- Invalid input outside a chain is ignored. Invalid input inside a chain preserves the selection and logs the most recent stage fallback when defined.
- All keydowns call `preventDefault()`, including unused keys.

## Turn-cost rule of thumb

`Action.success()` sets `consumesTurn = true`; `fail()` and `info()` only log and leave it false. `resolve(false)` forces a free action and `resolve(true)` forces a spent turn. Immediate pending actions are recursively drained, so a wrapper such as pickup/unpack, move-into-mob, unarmed attack, or full-backpack unequip inherits turn consumption from the action it queues.

## Input state machine

1. `src/main.ts` intercepts every `keydown`, calls `preventDefault()`, and retains `keyboardChain` between events.
2. `mapKeyboardEventToAction()` selects either the root map from `createKeyboardToAction()` or the active chain's `current` map.
3. A command may contain a direct action or a function returning an action, a nested key map, or `void`.
4. Nested maps keep the chain active and optionally emit an internal prompt log.
5. `void` advances an array-backed chain to its next command stage.
6. A returned `GameAction` clears the keyboard chain and is dispatched.
7. Invalid keys preserve an active chain and may emit the last command's `fallback`; outside a chain they are ignored.

`cleanup` is stage-specific. It is invoked during cancellation, while command callbacks themselves reset highlights after successful confirmation.

## Action and turn flow

`main.ts` → keyboard mapper → `game.dispatch()` → `dispatchGameAction()` → `resolveGameAction()` → player resolver.

- Player action types and payloads: `src/game/systems/player/types.ts`.
- Player resolver registration: `src/game/systems/player/resolvers.ts`.
- Combined resolver map: `src/game/systems/actions/gameAction/resolvers.ts`.
- Dispatch and world-turn handling: `src/game/systems/actions/gameAction/dispatchGameAction.ts`.

Dispatch records player actions, recursively drains immediate/timed pending actions, and runs `runWorldTurn()` when any drained resolution consumes a turn. It then checks end conditions, flushes logs, and increments `STATE.turn`. Inspect explicitly resolves with `false`; wait explicitly resolves with `true`. Confirm other actions in their resolver rather than assuming their turn cost.

Movement is also the normal attack input: `resolvePlayerMoveAction` converts an attempted move into an occupied adjacent tile into `PLAYER_ATTACK`. `resolvePlayerAttackAction` uses the equipped attack weapon; without one it queues `PLAYER_POKE`.

When the game is over, pending game-over, or won, `main.ts` discards the keyboard chain and any key advances/reset-dispatches according to game state.
