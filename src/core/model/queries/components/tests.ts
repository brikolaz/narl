import { expect } from "vitest";
import type { GameState } from "../../../../game/state/state";
import type { Component } from "../../Component";
import type { Entity } from "../../Entity";

export const expectComponentAttached = (
  state: GameState,
  entity: Entity,
  component: Component,
) => {
  expect(entity.componentById.get(component.id)).toBe(component);
  expect(entity.componentByType.get(component.type)?.get(component.id)).toBe(
    component,
  );
  expect(state.componentRegistryById[component.id]).toEqual({
    component,
    parent: entity,
  });
};

export const expectComponentsAttached = (
  state: GameState,
  entity: Entity,
  ...components: Component[]
) => {
  for (const component of components) {
    expectComponentAttached(state, entity, component);
  }
};

export const expectComponentDetached = (
  state: GameState,
  entity: Entity,
  component: Component,
) => {
  expect(entity.componentById.get(component.id)).not.toBe(component);
  expect(
    entity.componentByType.get(component.type)?.get(component.id),
  ).not.toBe(component);
  expect(state.componentRegistryById[component.id]).not.toBe(component);
};

export const expectComponentsDetached = (
  state: GameState,
  entity: Entity,
  ...components: Component[]
) => {
  for (const component of components) {
    expectComponentDetached(state, entity, component);
  }
};