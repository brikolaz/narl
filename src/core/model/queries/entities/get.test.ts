import { beforeEach, describe, expect, it } from "vitest";

import { initState } from "../../../../game/state/state";
import { EntityRole, getEntityCreator } from "../../Entity";
import { upsertRoleEntities } from "./add";
import { getEntitiesByRole, getEntityById, getEntityByRole } from "./get";

const TestEntity = getEntityCreator("TEST_ENTITY");

describe("entity getters", () => {
  beforeEach(() => initState());

  describe("getEntityById", () => {
    it("gets a registered entity", () => {
      const entity = TestEntity();
      expect(getEntityById(entity.id)).toBe(entity);
    });

    it("returns undefined for an unresolved id", () => {
      expect(getEntityById(Infinity)).toBeUndefined();
    });
  });

  describe("getEntitiesByRole", () => {
    describe("with entity object", () => {
      it("gets children matching the role", () => {
        const parent = TestEntity();
        const first = TestEntity();
        const second = TestEntity();
        upsertRoleEntities(parent, { [EntityRole.ITEM]: [first, second] });
        expect(getEntitiesByRole(parent, EntityRole.ITEM)).toEqual([first, second]);
      });
    });

    describe("with entity id", () => {
      it("gets children matching the role", () => {
        const parent = TestEntity();
        const first = TestEntity();
        const second = TestEntity();
        upsertRoleEntities(parent, { [EntityRole.ITEM]: [first, second] });
        expect(getEntitiesByRole(parent.id, EntityRole.ITEM)).toEqual([first, second]);
      });
    });
  });

  describe("getEntityByRole", () => {
    describe("with entity object", () => {
      it("gets the first child matching the role", () => {
        const parent = TestEntity();
        const first = TestEntity();
        const second = TestEntity();
        upsertRoleEntities(parent, { [EntityRole.ITEM]: [first, second] });
        expect(getEntityByRole(parent, EntityRole.ITEM)).toBe(first);
      });
    });

    describe("with entity id", () => {
      it("gets the first child matching the role", () => {
        const parent = TestEntity();
        const child = TestEntity();
        upsertRoleEntities(parent, { [EntityRole.ITEM]: child });
        expect(getEntityByRole(parent.id, EntityRole.ITEM)).toBe(child);
      });
    });
  });

  describe("with undefined entity", () => {
    it("returns an empty array from getEntitiesByRole", () => {
      expect(getEntitiesByRole(undefined, EntityRole.ITEM)).toEqual([]);
    });

    it("returns undefined from getEntityByRole", () => {
      expect(getEntityByRole(undefined, EntityRole.ITEM)).toBeUndefined();
    });
  });
});
