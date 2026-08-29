import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { initState, type GameState } from "../../../../game/state/state";
import { getEntityCreator } from "../../Entity";
import { patchEntity } from "./patch";
import { expectEntityRoot, expectEntityStateConsistent } from "./tests";

const TestEntity = getEntityCreator("TEST_ENTITY");

describe("patchEntity", () => {
  let state: GameState;
  beforeEach(() => {
    state = initState();
  });
  afterEach(() => {
    expectEntityStateConsistent(state);
  });

  describe("with entity object", () => {
    it("patches the entity", () => {
      const entity = TestEntity();
      const replacementType = Symbol("replacement");
      patchEntity(entity, (target) => {
        target.type = replacementType;
      });
      expect(entity.type).toBe(replacementType);
      expectEntityRoot(state, entity);
    });
  });

  describe("with entity id", () => {
    it("patches the entity", () => {
      const entity = TestEntity();
      const replacementType = Symbol("replacement");
      patchEntity(entity.id, (target) => {
        target.type = replacementType;
      });
      expect(entity.type).toBe(replacementType);
      expectEntityRoot(state, entity);
    });
  });

  describe("with undefined entity", () => {
    it("does not invoke the patcher", () => {
      const patcher = vi.fn();
      patchEntity(undefined, patcher);
      expect(patcher).not.toHaveBeenCalled();
    });
  });
});
