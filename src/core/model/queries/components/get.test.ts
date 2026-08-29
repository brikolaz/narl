import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { initState, type GameState } from "../../../../game/state/state";
import { getComponentCreator } from "../../Component";
import { getEntityCreator } from "../../Entity";
import { upsertComponents } from "./add";
import {
  getComponentById,
  getComponentByType,
  getComponentsByType,
  getComponentsByTypes,
} from "./get";
import { expectComponentStateConsistent } from "./tests";

const TestEntity = getEntityCreator("TEST_ENTITY");
const TestComponent = getComponentCreator("TEST_COMPONENT");
const AnotherTestComponent = getComponentCreator("ANOTHER_TEST_COMPONENT");

describe("component getters", () => {
  let state: GameState;
  beforeEach(() => {
    state = initState();
  });
  afterEach(() => {
    expectComponentStateConsistent(state);
  });

  describe("getComponentById", () => {
    it("gets one component by id", () => {
      const entity = TestEntity();
      const component = TestComponent();
      upsertComponents(entity, component);

      expect(getComponentById(component.id)).toBe(component);
    });

    it("returns undefined for an unresolved id", () => {
      expect(getComponentById(Infinity)).toBeUndefined();
    });
  });

  describe("getComponentsByType", () => {
    describe("with entity object", () => {
      it("gets with component creator", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(getComponentsByType(entity, TestComponent)).toEqual([
          first,
          second,
        ]);
      });

      it("gets with component object", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(getComponentsByType(entity, first)).toEqual([first, second]);
      });

      it("gets with component type", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(getComponentsByType(entity, TestComponent.type)).toEqual([
          first,
          second,
        ]);
      });
    });

    describe("with entity id", () => {
      it("gets with component creator", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(getComponentsByType(entity.id, TestComponent)).toEqual([
          first,
          second,
        ]);
      });

      it("gets with component object", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(getComponentsByType(entity.id, first)).toEqual([first, second]);
      });

      it("gets with component type", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(getComponentsByType(entity.id, TestComponent.type)).toEqual([
          first,
          second,
        ]);
      });
    });
  });

  describe("getComponentsByTypes", () => {
    describe("with entity object", () => {
      it("gets with component creators", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(
          getComponentsByTypes(entity, [
            TestComponent,
            AnotherTestComponent,
          ]),
        ).toEqual([first, second, other]);
      });

      it("gets with component objects", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(getComponentsByTypes(entity, [first, other])).toEqual([
          first,
          second,
          other,
        ]);
      });

      it("gets with component types", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(
          getComponentsByTypes(entity, [
            TestComponent.type,
            AnotherTestComponent.type,
          ]),
        ).toEqual([first, second, other]);
      });
    });

    describe("with entity id", () => {
      it("gets with component creators", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(
          getComponentsByTypes(entity.id, [
            TestComponent,
            AnotherTestComponent,
          ]),
        ).toEqual([first, second, other]);
      });

      it("gets with component objects", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(getComponentsByTypes(entity.id, [first, other])).toEqual([
          first,
          second,
          other,
        ]);
      });

      it("gets with component types", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const other = AnotherTestComponent();
        upsertComponents(entity, first, second, other);

        expect(
          getComponentsByTypes(entity.id, [
            TestComponent.type,
            AnotherTestComponent.type,
          ]),
        ).toEqual([first, second, other]);
      });
    });
  });

  describe("getComponentByType", () => {
    describe("with entity object", () => {
      it("gets with component creator", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        upsertComponents(entity, first, second);

        expect(getComponentByType(entity, TestComponent)).toBe(first);
      });

      it("gets with component object", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        upsertComponents(entity, first, second);

        expect(getComponentByType(entity, first)).toBe(first);
      });

      it("gets with component type", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        upsertComponents(entity, first, second);

        expect(getComponentByType(entity, TestComponent.type)).toBe(first);
      });
    });

    describe("with entity id", () => {
      it("gets with component creator", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        upsertComponents(entity, first, second);

        expect(getComponentByType(entity.id, TestComponent)).toBe(first);
      });

      it("gets with component object", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        upsertComponents(entity, first, second);

        expect(getComponentByType(entity.id, first)).toBe(first);
      });

      it("gets with component type", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        upsertComponents(entity, first, second);

        expect(getComponentByType(entity.id, TestComponent.type)).toBe(first);
      });
    });
  });

  describe("with undefined entity", () => {
    it("returns an empty array from getComponentsByType", () => {
      expect(getComponentsByType(undefined, TestComponent)).toEqual([]);
    });

    it("returns an empty array from getComponentsByTypes", () => {
      expect(getComponentsByTypes(undefined, [TestComponent])).toEqual([]);
    });

    it("returns undefined from getComponentByType", () => {
      expect(getComponentByType(undefined, TestComponent)).toBeUndefined();
    });
  });
});
