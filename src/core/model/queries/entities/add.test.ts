import { afterEach, beforeEach, describe, it, vi } from "vitest"

import { initState, type GameState } from "../../../../game/state/state"
import { isIntegrityCheckEnabled } from "../../../../tests/integrity"
import { EntityRoleEnum, getEntityCreator } from "../../Entity"
import { upsertEntities, upsertRoleEntities } from "./add"
import {
  expectEntityAttached,
  expectEntityNotAttached,
  expectEntityRoot,
  expectEntityStateConsistent,
} from "./tests"

const TestEntity = getEntityCreator("TEST_ENTITY")

describe("entity upserting", () => {
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

  describe("upsertEntities", () => {
    describe("with entity object", () => {
      it("adds children under the default role", () => {
        const parent = TestEntity()
        const first = TestEntity()
        const second = TestEntity()
        upsertEntities(parent, first, second)
        expectEntityAttached(state, parent, first, EntityRoleEnum.DEFAULT)
        expectEntityAttached(state, parent, second, EntityRoleEnum.DEFAULT)
      })
    })

    describe("with entity id", () => {
      it("adds children under the default role", () => {
        const parent = TestEntity()
        const child = TestEntity()
        upsertEntities(parent.id, child)
        expectEntityAttached(state, parent, child, EntityRoleEnum.DEFAULT)
      })
    })
  })

  describe("upsertRoleEntities", () => {
    describe("with entity object", () => {
      it("adds children under explicit roles", () => {
        const parent = TestEntity()
        const backpack = TestEntity()
        const item = TestEntity()
        upsertRoleEntities(parent, {
          [EntityRoleEnum.BACKPACK]: backpack,
          [EntityRoleEnum.ITEM]: item,
        })
        expectEntityAttached(state, parent, backpack, EntityRoleEnum.BACKPACK)
        expectEntityAttached(state, parent, item, EntityRoleEnum.ITEM)
      })
    })

    describe("with entity id", () => {
      it("adds children under explicit roles", () => {
        const parent = TestEntity()
        const child = TestEntity()
        upsertRoleEntities(parent.id, { [EntityRoleEnum.ITEM]: child })
        expectEntityAttached(state, parent, child, EntityRoleEnum.ITEM)
      })
    })
  })

  it("moves a child registry record to a new parent", () => {
    const firstParent = TestEntity()
    const secondParent = TestEntity()
    const child = TestEntity()
    upsertEntities(firstParent, child)

    upsertRoleEntities(secondParent, { [EntityRoleEnum.ITEM]: child })

    expectEntityNotAttached(firstParent, child, EntityRoleEnum.DEFAULT)
    expectEntityAttached(state, secondParent, child, EntityRoleEnum.ITEM)
  })

  describe("with undefined entity", () => {
    it("does not attach child in upsertEntities", () => {
      const child = TestEntity()
      upsertEntities(undefined, child)
      expectEntityRoot(state, child)
    })

    it("does not attach child in upsertRoleEntities", () => {
      const child = TestEntity()
      upsertRoleEntities(undefined, { [EntityRoleEnum.ITEM]: child })
      expectEntityRoot(state, child)
    })
  })
})
