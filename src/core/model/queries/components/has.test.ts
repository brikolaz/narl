import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { initState, type GameState } from "../../../../game/state/state";
import { getComponentCreator } from "../../Component";
import { getEntityCreator } from "../../Entity";
import { upsertComponents } from "./add";
import {
  areComponentTypesEqual,
  hasComponent,
  hasComponentsByType,
  isComponentType,
} from "./has";
import { expectComponentStateConsistent } from "./tests";

const TestEntity = getEntityCreator("TEST_ENTITY");
const TestComponent = getComponentCreator("TEST_COMPONENT");
const AnotherTestComponent = getComponentCreator("ANOTHER_TEST_COMPONENT");

describe("component predicates", () => {
  let state: GameState;
  beforeEach(() => {
    state = initState();
  });
  afterEach(() => {
    expectComponentStateConsistent(state);
  });

  describe("areComponentTypesEqual", () => {
    it("returns true for no components", () => {
      expect(areComponentTypesEqual()).toBe(true);
    });

    it("returns true with matching component creators", () => {
      expect(areComponentTypesEqual(TestComponent, TestComponent)).toBe(true);
    });

    it("returns true with matching component objects", () => {
      const first = TestComponent();
      const second = TestComponent();
      expect(areComponentTypesEqual(first, second)).toBe(true);
    });

    it("returns true with matching component types", () => {
      expect(
        areComponentTypesEqual(TestComponent.type, TestComponent.type),
      ).toBe(true);
    });

    it("returns false for different component types", () => {
      expect(areComponentTypesEqual(TestComponent(), AnotherTestComponent)).toBe(false);
    });
  });

  describe("isComponentType", () => {
    it("returns true with matching component creators", () => {
      expect(isComponentType(TestComponent, TestComponent)).toBe(true);
    });

    it("returns true with matching component objects", () => {
      expect(isComponentType(TestComponent(), TestComponent())).toBe(true);
    });

    it("returns true with matching component types", () => {
      expect(isComponentType(TestComponent.type, TestComponent.type)).toBe(
        true,
      );
    });
    
    it("returns true with matching component type and creator", () => {
      expect(isComponentType(TestComponent, TestComponent.type)).toBe(
        true,
      );
    });

    it("returns false for a different component type", () => {
      expect(isComponentType(TestComponent(), AnotherTestComponent.type)).toBe(false);
    });
  });

  describe("hasComponentsByType", () => {
    describe("with entity object", () => {
      it("returns true with component creator", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        expect(hasComponentsByType(entity, TestComponent)).toBe(true);
      });

      it("returns true with component object", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        expect(hasComponentsByType(entity, component)).toBe(true);
      });

      it("returns true with component type", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        expect(hasComponentsByType(entity, TestComponent.type)).toBe(true);
      });

      it("returns false with missing component type", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        expect(hasComponentsByType(entity, AnotherTestComponent.type)).toBe(false);
      });
    });

    describe("with entity id", () => {
      it("returns true with component creator", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        expect(hasComponentsByType(entity.id, TestComponent)).toBe(true);
      });

      it("returns true with component object", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        expect(hasComponentsByType(entity.id, component)).toBe(true);
      });

      it("returns true with component type", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        expect(hasComponentsByType(entity.id, TestComponent.type)).toBe(true);
      });
    });
  });

  describe("hasComponent", () => {
    describe("with entity object", () => {
      it("returns true with component object", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        expect(hasComponent(entity, component)).toBe(true);
      });

      it("returns true with component id", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        expect(hasComponent(entity, component.id)).toBe(true);
      });
    });

    describe("with entity id", () => {
      it("returns true with component object", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        expect(hasComponent(entity.id, component)).toBe(true);
      });

      it("returns true with component id", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        expect(hasComponent(entity.id, component.id)).toBe(true);
      });
    });
  });

  describe("with undefined entity", () => {
    it("returns false from hasComponentsByType", () => {
      expect(hasComponentsByType(undefined, TestComponent)).toBe(false);
    });

    it("returns false from hasComponent", () => {
      expect(hasComponent(undefined, Infinity)).toBe(false);
    });
  });
});
