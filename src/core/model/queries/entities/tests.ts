import { expect } from "vitest";
import type { GameState } from "../../../../game/state/state";
import type { Entity, EntityRole } from "../../Entity";

export const expectEntityAttached = (
  state: GameState,
  parent: Entity,
  child: Entity,
  role: EntityRole,
) => {
  expect(parent.entityById.get(child.id)).toBe(child);
  expect(parent.entityByRole.get(role)?.has(child)).toBe(true);
  expect(state.entityRegistryById[child.id]).toEqual({
    entity: child,
    parent,
    role,
  });
};
