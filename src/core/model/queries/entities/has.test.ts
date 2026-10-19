import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { initState, type GameState } from "../../../../game/state/state"
import { isIntegrityCheckEnabled } from "../../../../tests/integrity"
import { EntityRoleEnum, getEntityCreator } from "../../Entity"
import { upsertRoleEntities } from "./add"
import { hasEntitiesByRole, hasEntity, isEntity } from "./has"
import { detachEntity, removeEntity } from "./remove"
import { expectEntityStateConsistent } from "./tests"

const TestEntity = getEntityCreator("TEST_ENTITY")

describe("has", () => {
  let state: GameState
  beforeEach(() => {
    state = initState()
  })
  afterEach(() => {
    if (isIntegrityCheckEnabled()) {
      expectEntityStateConsistent(state)
    }

    vi.restoreAllMocks()
  })

  describe("isEntity", () => {
    it("recognizes a registered root entity", () => {
      expect(isEntity(TestEntity())).toBe(true)
    })

    it("recognizes an attached entity and keeps recognizing it after detachment", () => {
      const parent = TestEntity()
      const child = TestEntity()
      upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: child })
      expect(isEntity(child)).toBe(true)
      detachEntity(child)
      expect(isEntity(child)).toBe(true)
    })

    it("rejects a copy with the same id and component maps", () => {
      const entity = TestEntity()
      expect(isEntity({ ...entity })).toBe(false)
      expect(isEntity(entity)).toBe(true)
    })

    it("rejects an id or a different object referring to a registered entity", () => {
      const entity = TestEntity()
      expect(isEntity(entity.id)).toBe(false)
      expect(isEntity({ id: entity.id })).toBe(false)
      expect(isEntity({ id: String(entity.id) })).toBe(false)
      expect(isEntity({ id: BigInt(entity.id) })).toBe(false)
    })

    it("rejects a complete entity whose id is not registered", () => {
      const entity = TestEntity()
      expect(isEntity({ ...entity, id: state.getId() })).toBe(false)
    })

    it("rejects an entity after removal from the registry", () => {
      const entity = TestEntity()
      expect(isEntity(entity)).toBe(true)
      removeEntity(entity)
      expect(isEntity(entity)).toBe(false)
    })

    it("rejects an entity removed through its parent", () => {
      const parent = TestEntity()
      const child = TestEntity()
      upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: child })
      removeEntity(parent)
      expect(isEntity(parent)).toBe(false)
      expect(isEntity(child)).toBe(false)
    })

    it.each([
      undefined,
      null,
      false,
      true,
      0,
      "entity",
      Symbol("entity"),
      () => undefined,
      [],
      {},
      { id: undefined },
      { id: null },
      { id: "1" },
      { id: false },
      { id: Number.NaN },
      { id: Number.POSITIVE_INFINITY },
      { id: -1 },
    ])("rejects invalid input without throwing: %j", (value) => {
      expect(isEntity(value)).toBe(false)
    })
  })

  describe("hasEntitiesByRole", () => {
    describe("with entity object", () => {
      it("returns true for an attached role", () => {
        const parent = TestEntity()
        upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: TestEntity() })
        expect(hasEntitiesByRole(parent, EntityRoleEnum.ITEM)).toBe(true)
      })
    })

    describe("with entity id", () => {
      it("returns true for an attached role", () => {
        const parent = TestEntity()
        upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: TestEntity() })
        expect(hasEntitiesByRole(parent.id, EntityRoleEnum.ITEM)).toBe(true)
      })
    })
  })

  describe("hasEntity", () => {
    describe("with parent entity object", () => {
      it("returns true with child entity object", () => {
        const parent = TestEntity()
        const child = TestEntity()
        upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: child })
        expect(hasEntity(parent, child)).toBe(true)
      })

      it("returns true with child entity id", () => {
        const parent = TestEntity()
        const child = TestEntity()
        upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: child })
        expect(hasEntity(parent, child.id)).toBe(true)
      })
    })

    describe("with parent entity id", () => {
      it("returns true with child entity object", () => {
        const parent = TestEntity()
        const child = TestEntity()
        upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: child })
        expect(hasEntity(parent.id, child)).toBe(true)
      })

      it("returns true with child entity id", () => {
        const parent = TestEntity()
        const child = TestEntity()
        upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: child })
        expect(hasEntity(parent.id, child.id)).toBe(true)
      })
    })
  })

  describe("with undefined entity", () => {
    it("returns false from hasEntitiesByRole", () => {
      expect(hasEntitiesByRole(undefined, EntityRoleEnum.ITEM)).toBe(false)
    })

    it("returns false from hasEntity", () => {
      expect(hasEntity(undefined, undefined)).toBe(false)
    })
  })
})
