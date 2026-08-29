import { beforeEach, describe, expect, it, vi } from "vitest";

import { initState } from "../../../../game/state/state";
import { getComponentCreator } from "../../Component";
import { getEntityCreator } from "../../Entity";
import { upsertComponents } from "./add";
import {
  patchComponent,
  patchComponentByType,
  replaceComponentsByType,
} from "./patch";

const TestEntity = getEntityCreator("TEST_ENTITY");
type TestComponentProps = { value: number }
const TestComponent = getComponentCreator<TestComponentProps>("TEST_COMPONENT", { value: 0 });

describe("component patching", () => {
  beforeEach(() => initState());

  describe("patchComponent", () => {
    it("patches with component object", () => {
      const entity = TestEntity();
      const component = TestComponent();
      upsertComponents(entity, component);

      patchComponent(component, (target) => {
        target.value = 10;
      });

      expect(component.value).toBe(10);
    });

    it("patches with component id", () => {
      const entity = TestEntity();
      const component = TestComponent();
      upsertComponents(entity, component);

      patchComponent<{ value: number }>(component.id, (target) => {
        target.value = 10;
      });

      expect(component.value).toBe(10);
    });
  });

  describe("patchComponentByType", () => {
    describe("with entity object", () => {
      it("patches with component creator", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        patchComponentByType(entity, TestComponent, (target) => {
          target.value = 20;
        });
        expect(component.value).toBe(20);
      });

      it("patches with component object", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        patchComponentByType(entity, component, (target) => {
          target.value = 20;
        });
        expect(component.value).toBe(20);
      });

      it("patches with component type", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        patchComponentByType<TestComponentProps>(
          entity,
          TestComponent.type,
          (target) => {
            target.value = 20;
          },
        );
        expect(component.value).toBe(20);
      });
    });

    describe("with entity id", () => {
      it("patches with component creator", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        patchComponentByType(entity.id, TestComponent, (target) => {
          target.value = 20;
        });
        expect(component.value).toBe(20);
      });

      it("patches with component object", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        patchComponentByType(entity.id, component, (target) => {
          target.value = 20;
        });
        expect(component.value).toBe(20);
      });

      it("patches with component type", () => {
        const entity = TestEntity();
        const component = TestComponent();
        upsertComponents(entity, component);
        patchComponentByType<TestComponentProps>(
          entity.id,
          TestComponent.type,
          (target) => {
            target.value = 20;
          },
        );
        expect(component.value).toBe(20);
      });
    });
  });

  describe("replaceComponentsByType", () => {
    describe("with entity object", () => {
      it("replaces with component creator", () => {
        const entity = TestEntity();
        const component = TestComponent();
        const replacement = TestComponent({ value: 30 });
        upsertComponents(entity, component);
        replaceComponentsByType(entity, TestComponent, replacement);
        expect(entity.componentById.has(component.id)).toBe(false);
        expect(entity.componentById.get(replacement.id)).toBe(replacement);
      });

      it("replaces with component object", () => {
        const entity = TestEntity();
        const component = TestComponent();
        const replacement = TestComponent({ value: 30 });
        upsertComponents(entity, component);
        replaceComponentsByType(entity, component, replacement);
        expect(entity.componentById.has(component.id)).toBe(false);
        expect(entity.componentById.get(replacement.id)).toBe(replacement);
      });

      it("replaces with component type", () => {
        const entity = TestEntity();
        const first = TestComponent();
        const second = TestComponent();
        const replacement = TestComponent({ value: 30 });
        upsertComponents(entity, first, second);

        replaceComponentsByType(entity, TestComponent.type, replacement);

        expect(entity.componentById.has(first.id)).toBe(false);
        expect(entity.componentById.has(second.id)).toBe(false);
        expect(entity.componentById.get(replacement.id)).toBe(replacement);
      });
    });

    describe("with entity id", () => {
      it("replaces with component creator", () => {
        const entity = TestEntity();
        const component = TestComponent();
        const replacement = TestComponent({ value: 30 });
        upsertComponents(entity, component);
        replaceComponentsByType(entity.id, TestComponent, replacement);
        expect(entity.componentById.has(component.id)).toBe(false);
        expect(entity.componentById.get(replacement.id)).toBe(replacement);
      });

      it("replaces with component object", () => {
        const entity = TestEntity();
        const component = TestComponent();
        const replacement = TestComponent({ value: 30 });
        upsertComponents(entity, component);
        replaceComponentsByType(entity.id, component, replacement);
        expect(entity.componentById.has(component.id)).toBe(false);
        expect(entity.componentById.get(replacement.id)).toBe(replacement);
      });

      it("replaces with component type", () => {
        const entity = TestEntity();
        const component = TestComponent();
        const replacement = TestComponent({ value: 30 });
        upsertComponents(entity, component);
        replaceComponentsByType(entity.id, component.type, replacement);
        expect(entity.componentById.has(component.id)).toBe(false);
        expect(entity.componentById.get(replacement.id)).toBe(replacement);
      });
    });
  });

  describe("with unresolved input", () => {
    it("does not invoke patcher in patchComponent", () => {
      const patcher = vi.fn();
      patchComponent(Infinity, patcher);
      expect(patcher).not.toHaveBeenCalled();
    });

    it("does not invoke patcher in patchComponentByType", () => {
      const patcher = vi.fn();
      patchComponentByType(undefined, TestComponent, patcher);
      expect(patcher).not.toHaveBeenCalled();
    });
  });
});
