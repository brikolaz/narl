import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { initState, type GameState } from "../../../../game/state/state";
import { getComponentCreator } from "../../Component";
import { getEntityCreator } from "../../Entity";
import { upsertComponents } from "./add";
import { removeComponents, removeComponentsByType } from "./remove";
import {
  expectComponentAttached,
  expectComponentDetached,
  expectComponentsAttached,
  expectComponentsDetached,
  expectComponentStateConsistent,
} from "./tests";

const TestEntity = getEntityCreator("TEST_ENTITY");
const TestComponent = getComponentCreator("TEST_COMPONENT");
const AnotherTestComponent = getComponentCreator("ANOTHER_TEST_COMPONENT");

describe("component removal", () => {
  let state: GameState;
  beforeEach(() => {
    state = initState();
  });
  afterEach(() => {
    expectComponentStateConsistent(state);
  });

  describe("removeComponents", () => {
    it("removes with component object", () => {
      const entity = TestEntity();
      const removed = TestComponent();
      const preserved = TestComponent();
      upsertComponents(entity, removed, preserved);
      removeComponents(removed);
      expectComponentDetached(state, entity, removed)
      expectComponentsAttached(state, entity, preserved);
    });

    it("removes with component id", () => {
      const entity = TestEntity();
      const removed = TestComponent();
      const preserved = TestComponent();
      upsertComponents(entity, removed, preserved);
      removeComponents(removed.id);
      expectComponentDetached(state, entity, removed);
      expectComponentAttached(state, entity, preserved);
    });
  });

  describe("removeComponentsByType", () => {
    describe("with entity object", () => {
      it("removes with component creator", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        removeComponentsByType(entity, TestComponent);
        expectComponentDetached(state, entity, component);
      });

      it("removes with component object", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        removeComponentsByType(entity, component);
        expectComponentDetached(state, entity, component);
      });

      it("removes with component type", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const preserved = AnotherTestComponent();
        upsertComponents(entity, first, second, preserved);
        removeComponentsByType(entity, first.type);
        expectComponentsDetached(state, entity, first, second);
        expectComponentAttached(state, entity, preserved);
      });
    });

    describe("with entity id", () => {
      it("removes with component creator", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        removeComponentsByType(entity.id, TestComponent);
        expectComponentDetached(state, entity, component);
      });

      it("removes with component object", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        removeComponentsByType(entity.id, component);
        expectComponentDetached(state, entity, component);
      });

      it("removes with component type", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        removeComponentsByType(entity.id, component.type);
        expectComponentDetached(state, entity, component);
      });
    });
  });

  describe("with unresolved input", () => {
    it("does not throw in removeComponents", () => {
      expect(() => removeComponents(Infinity)).not.toThrow();
    });

    it("does not throw in removeComponentsByType", () => {
      expect(() => removeComponentsByType(undefined, TestComponent)).not.toThrow();
    });
  });
});
