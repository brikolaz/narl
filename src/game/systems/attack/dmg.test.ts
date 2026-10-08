import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../core/model/Entity"
import type { Component } from "../../../core/model/Component"
import { upsertComponents } from "../../../core/model/queries/components/add"
import { patchComponentByType } from "../../../core/model/queries/components/patch"
import { upsertRoleEntities } from "../../../core/model/queries/entities/add"
import { createGame, type Game } from "../../../game"
import { clearItems, clearMobs } from "../../../tests/clear"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../tests/integrity"
import { DefComponent } from "../../model/components/combat/DefComponent"
import { DmgComponent } from "../../model/components/combat/DmgComponent"
import { DmgMulComponent } from "../../model/components/combat/DmgMulComponent"
import { ContainerComponent } from "../../model/components/containers/ContainerComponent"
import { OffensiveContainerCurseComponent } from "../../model/components/curse/OffensiveContainerCurseComponent"
import { NameComponent } from "../../model/components/display/NameComponent"
import { getItemInspectText } from "../inspect/inspect"
import { getChildrenDefToDmg, getChildrenDmgRange, getDmgRange } from "./dmg"

const TestContainer = getEntityCreator("TEST_CURSED_CONTAINER")
const TestItem = getEntityCreator("TEST_CURSED_CONTAINER_ITEM")

const createCursedContainer = (): Entity => {
  const container = TestContainer()
  upsertComponents(
    container,
    ContainerComponent(),
    NameComponent({ name: "Cursed Backpack" }),
    DmgMulComponent({ dmgMul: 0.5 }),
    OffensiveContainerCurseComponent({
      dmgMul: 0.5,
      defToDmgMul: 0.25,
    }),
  )
  return container
}

const addItem = (container: Entity, ...components: Component[]): void => {
  const item = TestItem()
  upsertComponents(item, ...components)
  upsertRoleEntities(container, { [EntityRoleEnum.ITEM]: item })
}

describe("dmg", () => {
  let game: Game

  beforeEach(() => {
    game = createGame()
    clearMobs(game)
    clearItems(game)
  })

  afterEach(() => {
    if (isIntegrityCheckEnabled()) {
      expectGameStateConsistent(game)
    }

    vi.restoreAllMocks()
  })

  it("converts the aggregate direct children DEF at the configured one-quarter ratio", () => {
    const backpack = createCursedContainer()
    addItem(backpack, DefComponent({ def: 2 }))
    addItem(backpack, DefComponent({ def: 2 }))

    expect(getChildrenDefToDmg(backpack)).toBe(1)
    expect(getChildrenDmgRange(backpack)).toEqual({ min: 1, max: 1 })
  })

  it("does not multiply converted DEF damage by the contents damage multiplier", () => {
    const backpack = createCursedContainer()
    addItem(
      backpack,
      DmgComponent({ min: 2, max: 2 }),
      DefComponent({ def: 4 }),
    )

    expect(getDmgRange(backpack)).toEqual({ min: 2, max: 2 })

    patchComponentByType(backpack, DmgMulComponent, (component) => {
      component.dmgMul = 0
    })

    expect(getDmgRange(backpack)).toEqual({ min: 1, max: 1 })
  })

  it("converts effective DEF inherited through nested container children", () => {
    const backpack = createCursedContainer()
    const pouch = TestContainer()
    const armor = TestItem()
    upsertComponents(pouch, ContainerComponent())
    upsertComponents(armor, DefComponent({ def: 4 }))
    upsertRoleEntities(pouch, { [EntityRoleEnum.ITEM]: armor })
    upsertRoleEntities(backpack, { [EntityRoleEnum.ITEM]: pouch })

    expect(getChildrenDefToDmg(backpack)).toBe(1)
  })

  it("shows converted DEF damage separately in the contents inspect breakdown", () => {
    const backpack = createCursedContainer()
    addItem(backpack, DmgComponent({ min: 2, max: 2 }))
    addItem(backpack, DefComponent({ def: 4 }))

    expect(getItemInspectText(backpack)).toContain(
      "Contents: 2 DMG (2x0.5 + 4x0.25 from DEF)",
    )
  })
})
