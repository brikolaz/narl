import { beforeEach, describe, expect, it } from "vitest";

import { initState } from "../../../../game/state/state";
import { EntityRole, getEntityCreator } from "../../Entity";
import { normalizeChildrenEntityRecords, resolveEntity } from "./normalize";

const TestEntity = getEntityCreator("TEST_ENTITY");

describe("entity normalization", () => {
  beforeEach(() => initState());

  it("normalizeChildrenEntityRecords", () => {
    const first = TestEntity();
    const second = TestEntity();
    expect(normalizeChildrenEntityRecords([first, undefined, second])).toEqual({
      [EntityRole.DEFAULT]: [first, second],
    });
  });

  it("normalizes role records and removes undefined children", () => {
    const backpack = TestEntity();
    const item = TestEntity();
    expect(
      normalizeChildrenEntityRecords({
        [EntityRole.BACKPACK]: backpack,
        [EntityRole.ITEM]: [undefined, item],
      }),
    ).toEqual({
      [EntityRole.BACKPACK]: [backpack],
      [EntityRole.ITEM]: [item],
    });
  });

  describe("resolveEntity", () => {
    describe("with entity object", () => {
      it("returns the entity", () => {
        const entity = TestEntity();
        expect(resolveEntity(entity)).toBe(entity);
      });
    });

    describe("with entity id", () => {
      it("returns the registered entity", () => {
        const entity = TestEntity();
        expect(resolveEntity(entity.id)).toBe(entity);
      });
    });

    describe("with undefined entity", () => {
      it("returns undefined", () => {
        expect(resolveEntity(undefined)).toBeUndefined();
      });
    });
  });
});
