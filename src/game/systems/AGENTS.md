# Systems

## Action Resolvers

- Use domain helpers instead of ECS helpers when possible
- Keep state mutations inside a single IIFE
- Action resolvers represent deterministic state transitions
- The only allowed side effect is mutating the current GameState

## Curses

- Cursed Backpacks can't be opened

## Bootstrap

- Initialize `STATE` before invoking any game logic
