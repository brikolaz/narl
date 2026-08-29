import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { initState, type GameState } from "../../../../game/state/state";
import { getComponentCreator } from "../../Component";
import { EntityRole, getEntityCreator } from "../../Entity";
import { upsertComponents } from "../components/add";
import { upsertRoleEntities } from "./add";
import { detachEntity, removeEntitiesByRole, removeEntity } from "./remove";
import {
  expectEntityAttached,
  expectEntityDetached,
  expectEntityRemoved,
  expectEntityStateConsistent,
} from "./tests";

const TestEntity = getEntityCreator("TEST_ENTITY");
const TestComponent = getComponentCreator("TEST_COMPONENT");

describe("entity removal", () => {
  let state: GameState;
  beforeEach(() => {
    state = initState();
  });
  afterEach(() => {
    expectEntityStateConsistent(state);
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
        expectEntityRemoved(state, parent, child, EntityRole.ITEM);
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

    expectEntityRemoved(state, parent, item, EntityRole.ITEM);
    expectEntityAttached(state, parent, eq, EntityRole.EQ);
  });

  describe("detachEntity", () => {
    describe("with entity object", () => {
      it("detaches the entity from its parent", () => {
        const parent = TestEntity();
        const child = TestEntity();
        upsertRoleEntities(parent, { [EntityRole.ITEM]: child });
        detachEntity(child);
        expectEntityDetached(state, parent, child, EntityRole.ITEM);
      });
    });

    describe("with entity id", () => {
      it("detaches the entity from its parent", () => {
        const parent = TestEntity();
        const child = TestEntity();
        upsertRoleEntities(parent, { [EntityRole.ITEM]: child });
        detachEntity(child.id);
        expectEntityDetached(state, parent, child, EntityRole.ITEM);
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
