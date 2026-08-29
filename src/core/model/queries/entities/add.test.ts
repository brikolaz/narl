import { afterEach, beforeEach, describe, it } from "vitest";

import { initState, type GameState } from "../../../../game/state/state";
import { EntityRole, getEntityCreator } from "../../Entity";
import { upsertEntities, upsertRoleEntities } from "./add";
import {
  expectEntityAttached,
  expectEntityNotAttached,
  expectEntityRoot,
  expectEntityStateConsistent,
} from "./tests";

const TestEntity = getEntityCreator("TEST_ENTITY");

describe("entity upserting", () => {
  let state: GameState;
  beforeEach(() => {
    state = initState();
  });

  afterEach(() => {
    expectEntityStateConsistent(state);
  });

  describe("upsertEntities", () => {
    describe("with entity object", () => {
      it("adds children under the default role", () => {
        const parent = TestEntity();
        const first = TestEntity();
        const second = TestEntity();
        upsertEntities(parent, first, second);
        expectEntityAttached(state, parent, first, EntityRole.DEFAULT);
        expectEntityAttached(state, parent, second, EntityRole.DEFAULT);
      });
    });

    describe("with entity id", () => {
      it("adds children under the default role", () => {
        const parent = TestEntity();
        const child = TestEntity();
        upsertEntities(parent.id, child);
        expectEntityAttached(state, parent, child, EntityRole.DEFAULT);
      });
    });
  });

  describe("upsertRoleEntities", () => {
    describe("with entity object", () => {
      it("adds children under explicit roles", () => {
        const parent = TestEntity();
        const backpack = TestEntity();
        const item = TestEntity();
        upsertRoleEntities(parent, {
          [EntityRole.BACKPACK]: backpack,
          [EntityRole.ITEM]: item,
        });
        expectEntityAttached(state, parent, backpack, EntityRole.BACKPACK);
        expectEntityAttached(state, parent, item, EntityRole.ITEM);
      });
    });

    describe("with entity id", () => {
      it("adds children under explicit roles", () => {
        const parent = TestEntity();
        const child = TestEntity();
        upsertRoleEntities(parent.id, { [EntityRole.ITEM]: child });
        expectEntityAttached(state, parent, child, EntityRole.ITEM);
      });
    });
  });

  it("moves a child registry record to a new parent", () => {
    const firstParent = TestEntity();
    const secondParent = TestEntity();
    const child = TestEntity();
    upsertEntities(firstParent, child);

    upsertRoleEntities(secondParent, { [EntityRole.ITEM]: child });

    expectEntityNotAttached(firstParent, child, EntityRole.DEFAULT);
    expectEntityAttached(state, secondParent, child, EntityRole.ITEM);
  });

  describe("with undefined entity", () => {
    it("does not attach child in upsertEntities", () => {
      const child = TestEntity();
      upsertEntities(undefined, child);
      expectEntityRoot(state, child);
    });

    it("does not attach child in upsertRoleEntities", () => {
      const child = TestEntity();
      upsertRoleEntities(undefined, { [EntityRole.ITEM]: child });
      expectEntityRoot(state, child);
    });
  });
});
