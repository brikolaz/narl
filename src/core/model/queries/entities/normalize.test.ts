import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { initState, type GameState } from "../../../../game/state/state";
import { integrityCheckEnabled } from "../../../../tests/integrity";
import { EntityRole, getEntityCreator } from "../../Entity";
import { normalizeChildrenEntityRecords, resolveEntity } from "./normalize";
import { expectEntityStateConsistent } from "./tests";

const TestEntity = getEntityCreator("TEST_ENTITY");

describe("entity normalization", () => {
  let state: GameState;
  beforeEach(() => {
    state = initState();
  });
  afterEach(() => {
    if (integrityCheckEnabled()) {
      expectEntityStateConsistent(state);
    }

    vi.restoreAllMocks();
  });

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
