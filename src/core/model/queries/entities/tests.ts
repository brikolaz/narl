import { expect } from "vitest";
import type { GameState } from "../../../../game/state/state";
import type { Entity, EntityRole } from "../../Entity";

const expectEntityRegistryRecordConsistent = (
  state: GameState,
  entity: Entity,
) => {
  const record = state.entityRegistryById[entity.id];
  expect(record?.entity).toBe(entity);

  if (record?.parent === null) {
    expect(record.role).toBeNull();
    return;
  }

  expect(record?.role).not.toBeNull();
  expect(record?.parent?.entityById.get(entity.id)).toBe(entity);
  expect(record?.parent?.entityByRole.get(record.role!)?.has(entity)).toBe(true);
};

const expectEntityChildrenConsistent = (
  state: GameState,
  parent: Entity,
) => {
  for (const child of parent.entityById.values()) {
    expect(state.entityRegistryById[child.id]?.entity).toBe(child);
    expect(state.entityRegistryById[child.id]?.parent).toBe(parent);
  }
};

const expectEntityRolesConsistent = (
  state: GameState,
  parent: Entity,
) => {
  for (const [role, children] of parent.entityByRole) {
    for (const child of children) {
      expect(parent.entityById.get(child.id)).toBe(child);
      expect(state.entityRegistryById[child.id]?.parent).toBe(parent);
      expect(state.entityRegistryById[child.id]?.role).toBe(role);
    }
  }
};

export const expectEntityStateConsistent = (state: GameState) => {
  for (const [id, { entity }] of Object.entries(state.entityRegistryById)) {
    expect(entity.id).toBe(Number(id));
    expectEntityRegistryRecordConsistent(state, entity);
    expectEntityChildrenConsistent(state, entity);
    expectEntityRolesConsistent(state, entity);
  }
};

export const expectEntityAttached = (
  state: GameState,
  parent: Entity,
  child: Entity,
  role: EntityRole,
) => {
  expect(parent.entityById.get(child.id)).toBe(child);
  expect(parent.entityByRole.get(role)?.has(child)).toBe(true);
  expect(state.entityRegistryById[child.id]?.entity).toBe(child);
  expect(state.entityRegistryById[child.id]?.parent).toBe(parent);
  expect(state.entityRegistryById[child.id]?.role).toBe(role);
};

export const expectEntityNotAttached = (
  parent: Entity,
  child: Entity,
  role: EntityRole,
) => {
  expect(parent.entityById.get(child.id)).not.toBe(child);
  expect(parent.entityByRole.get(role)?.has(child)).not.toBe(true);
};

export const expectEntityDetached = (
  state: GameState,
  parent: Entity,
  child: Entity,
  role: EntityRole,
) => {
  expectEntityNotAttached(parent, child, role);
  expect(state.entityRegistryById[child.id]?.entity).toBe(child);
  expect(state.entityRegistryById[child.id]?.parent).toBeNull();
  expect(state.entityRegistryById[child.id]?.role).toBeNull();
};

export const expectEntityRemoved = (
  state: GameState,
  parent: Entity,
  child: Entity,
  role: EntityRole,
) => {
  expectEntityNotAttached(parent, child, role);
  expect(state.entityRegistryById[child.id]).toBeUndefined();
};

export const expectEntityRoot = (state: GameState, entity: Entity) => {
  expect(state.entityRegistryById[entity.id]?.entity).toBe(entity);
  expect(state.entityRegistryById[entity.id]?.parent).toBeNull();
  expect(state.entityRegistryById[entity.id]?.role).toBeNull();
};
