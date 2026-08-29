import { beforeEach, describe, expect, it } from "vitest";

import { initState } from "../../../../game/state/state";
import { getComponentCreator } from "../../Component";
import { getEntityCreator } from "../../Entity";
import { upsertComponents } from "./add";
import { resolveComponent, resolveComponentType } from "./normalize";

const TestEntity = getEntityCreator("TEST_ENTITY");
const TestComponent = getComponentCreator("TEST_COMPONENT");

describe("component normalization", () => {
  beforeEach(() => initState());

  describe("resolveComponentType", () => {
    it("resolves with component creator", () => {
      expect(resolveComponentType(TestComponent)).toBe(TestComponent.type);
    });

    it("resolves with component object", () => {
      expect(resolveComponentType(TestComponent())).toBe(TestComponent.type);
    });

    it("resolves with component type", () => {
      expect(resolveComponentType(TestComponent.type)).toBe(TestComponent.type);
    });
  });

  describe("resolveComponent", () => {
    it("resolves with component object", () => {
      const component = TestComponent();
      expect(resolveComponent(component)).toBe(component);
    });

    it("resolves with component id", () => {
      const entity = TestEntity();
      const component = TestComponent();
      upsertComponents(entity, component);
      expect(resolveComponent(component.id)).toBe(component);
    });

    describe("with unresolved component id", () => {
      it("returns undefined", () => {
        expect(resolveComponent(Infinity)).toBeUndefined();
      });
    });
  });
});
