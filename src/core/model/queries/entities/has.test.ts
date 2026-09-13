import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { initState, type GameState } from "../../../../game/state/state"
import { isIntegrityCheckEnabled } from "../../../../tests/integrity"
import { EntityRoleEnum, getEntityCreator } from "../../Entity"
import { upsertRoleEntities } from "./add"
import { hasEntitiesByRole, hasEntity } from "./has"
import { expectEntityStateConsistent } from "./tests"

const TestEntity = getEntityCreator("TEST_ENTITY")

describe("entity predicates", () => {
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
