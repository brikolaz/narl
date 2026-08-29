import { beforeEach, describe, expect, it, vi } from "vitest";

import { initState } from "../../../../game/state/state";
import { getEntityCreator } from "../../Entity";
import { patchEntity } from "./patch";

const TestEntity = getEntityCreator("TEST_ENTITY");

describe("patchEntity", () => {
  beforeEach(() => initState());

  describe("with entity object", () => {
    it("patches the entity", () => {
      const entity = TestEntity();
      const replacementType = Symbol("replacement");
      patchEntity(entity, (target) => {
        target.type = replacementType;
      });
      expect(entity.type).toBe(replacementType);
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
