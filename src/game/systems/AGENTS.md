# Systems

## Action Resolvers

- Use domain helpers instead of ECS helpers when possible
- Keep state mutations inside a single IIFE
- Action resolvers represent deterministic state transitions
- The only allowed side effect is mutating the current GameState

## Curses

- Cursed Backpacks can't be opened

## Death

- Wrap every state mutation that can kill the player in `initDeath()`
- Keep `initDeath()` independent of turn cost; record the death turn in the dispatcher after resolving the final `consumesTurn` value

## Bootstrap

- Initialize `STATE` before invoking any game logic
