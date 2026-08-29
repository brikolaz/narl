import { beforeEach, describe, expect, it } from "vitest";

import { initState, type GameState } from "../../../../game/state/state";
import { getComponentCreator } from "../../Component";
import { EntityRole, getEntityCreator } from "../../Entity";
import { upsertComponents } from "../components/add";
import { upsertRoleEntities } from "./add";
import { detachEntity, removeEntitiesByRole, removeEntity } from "./remove";

const TestEntity = getEntityCreator("TEST_ENTITY");
const TestComponent = getComponentCreator("TEST_COMPONENT");

describe("entity removal", () => {
  let state: GameState;
  beforeEach(() => {
    state = initState();
  });

  describe("removeEntity", () => {
    describe("with entity object", () => {
      it("removes the entity recursively", () => {
        const parent = TestEntity();
        const child = TestEntity();
        const grandchild = TestEntity();
        const component = TestComponent();
        upsertRoleEntities(parent, { [EntityRole.ITEM]: child });
        upsertRoleEntities(child, { [EntityRole.DEFAULT]: grandchild });
        upsertComponents(child, component);
        removeEntity(child);
        expect(state.entityRegistryById[child.id]).toBeUndefined();
        expect(state.entityRegistryById[grandchild.id]).toBeUndefined();
        expect(state.componentRegistryById[component.id]).toBeUndefined();
      });
    });

    describe("with entity id", () => {
      it("removes the entity", () => {
        const entity = TestEntity();
        removeEntity(entity.id);
        expect(state.entityRegistryById[entity.id]).toBeUndefined();
      });
    });
  });

  it("removes only children in selected roles", () => {
    const parent = TestEntity();
    const item = TestEntity();
    const eq = TestEntity();
    upsertRoleEntities(parent, {
      [EntityRole.ITEM]: item,
      [EntityRole.EQ]: eq,
    });

    removeEntitiesByRole(parent, EntityRole.ITEM);

    expect(state.entityRegistryById[item.id]).toBeUndefined();
    expect(state.entityRegistryById[eq.id]?.entity).toBe(eq);
  });

  describe("detachEntity", () => {
    describe("with entity object", () => {
      it("detaches the entity from its parent", () => {
        const parent = TestEntity();
        const child = TestEntity();
        upsertRoleEntities(parent, { [EntityRole.ITEM]: child });
        detachEntity(child);
        expect(parent.entityById.has(child.id)).toBe(false);
        expect(state.entityRegistryById[child.id]?.parent).toBeNull();
      });
    });

    describe("with entity id", () => {
      it("detaches the entity from its parent", () => {
        const parent = TestEntity();
        const child = TestEntity();
        upsertRoleEntities(parent, { [EntityRole.ITEM]: child });
        detachEntity(child.id);
        expect(parent.entityById.has(child.id)).toBe(false);
        expect(state.entityRegistryById[child.id]?.parent).toBeNull();
      });
    });
  });

  describe("with undefined entity", () => {
    it("does not throw in removeEntity", () => {
      expect(() => removeEntity(undefined)).not.toThrow();
    });

    it("does not throw in detachEntity", () => {
      expect(() => detachEntity(undefined)).not.toThrow();
    });
  });
});
