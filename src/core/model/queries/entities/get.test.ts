import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { initState, type GameState } from "../../../../game/state/state"
import { isIntegrityCheckEnabled } from "../../../../tests/integrity"
import { EntityRoleEnum, getEntityCreator } from "../../Entity"
import { upsertRoleEntities } from "./add"
import { getEntitiesByRole, getEntityById, getEntityByRole } from "./get"
import { expectEntityStateConsistent } from "./tests"

const TestEntity = getEntityCreator("TEST_ENTITY")

describe("entity getters", () => {
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

  describe("getEntityById", () => {
    it("gets a registered entity", () => {
      const entity = TestEntity()
      expect(getEntityById(entity.id)).toBe(entity)
    })

    it("returns undefined for an unresolved id", () => {
      expect(getEntityById(Infinity)).toBeUndefined()
    })
  })

  describe("getEntitiesByRole", () => {
    describe("with entity object", () => {
      it("gets children matching the role", () => {
        const parent = TestEntity()
        const first = TestEntity()
        const second = TestEntity()
        upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: [first, second] })
        expect(getEntitiesByRole(parent, EntityRoleEnum.ITEM)).toEqual([
          first,
          second,
        ])
      })
    })

    describe("with entity id", () => {
      it("gets children matching the role", () => {
        const parent = TestEntity()
        const first = TestEntity()
        const second = TestEntity()
        upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: [first, second] })
        expect(getEntitiesByRole(parent.id, EntityRoleEnum.ITEM)).toEqual([
          first,
          second,
        ])
      })
    })
  })

  describe("getEntityByRole", () => {
    describe("with entity object", () => {
      it("gets the first child matching the role", () => {
        const parent = TestEntity()
        const first = TestEntity()
        const second = TestEntity()
        upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: [first, second] })
        expect(getEntityByRole(parent, EntityRoleEnum.ITEM)).toBe(first)
      })
    })

    describe("with entity id", () => {
      it("gets the first child matching the role", () => {
        const parent = TestEntity()
        const child = TestEntity()
        upsertRoleEntities(parent, { [EntityRoleEnum.ITEM]: child })
        expect(getEntityByRole(parent.id, EntityRoleEnum.ITEM)).toBe(child)
      })
    })
  })

  describe("with undefined entity", () => {
    it("returns an empty array from getEntitiesByRole", () => {
      expect(getEntitiesByRole(undefined, EntityRoleEnum.ITEM)).toEqual([])
    })

    it("returns undefined from getEntityByRole", () => {
      expect(getEntityByRole(undefined, EntityRoleEnum.ITEM)).toBeUndefined()
    })
  })
})
