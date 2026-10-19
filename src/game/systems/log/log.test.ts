import { LOCALE } from "../../../utils/constants"
import type { MessageKey } from "../../i18n/types"
import * as messages from "../../i18n/messages"
import { createMessageFormatter } from "../../i18n/formatMessage"
import EN_MESSAGES from "../../i18n/en.json"
import { CursedComponent } from "../../model/components/state/CursedComponent"
import { getEntityLogProjection } from "./getEntityLogProjection"
import { InspectDescComponent } from "../../model/components/interaction/InspectDescComponent"
import { upsertRoleEntities } from "../../../core/model/queries/entities/add"
import { DmgComponent } from "../../model/components/combat/DmgComponent"
import { DefComponent } from "../../model/components/combat/DefComponent"
import { DmgMulComponent } from "../../model/components/combat/DmgMulComponent"
import { DefMulComponent } from "../../model/components/combat/DefMulComponent"
import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../core/model/Entity"
import { upsertComponents } from "../../../core/model/queries/components/add"
import { removeEntity } from "../../../core/model/queries/entities/remove"
import { isEntity } from "../../../core/model/queries/entities/has"
import { NameComponent } from "../../model/components/display/NameComponent"
import { formatLogMessage } from "../../render/formatLogMessage"
import { getGameViewModel } from "../../render/getGameViewModel"
import { getPlayer } from "../player/player"
import { Action } from "../actions/action"
import { getEntityName } from "../inspect/getEntityName"
import type { EntityLogProjection, LogMessage } from "./types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createGame, type Game } from "../../../game"
import { clearItems, clearMobs } from "../../../tests/clear"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../tests/integrity"
import {
  InternalActionTypeEnum,
  type InternalLogAction,
} from "../internal/types"
import { flushLogs } from "./log"

const TestLogEntity = getEntityCreator("TEST_LOG_ENTITY")

const action = {
  type: InternalActionTypeEnum.INTERNAL_LOG,
  message: { key: "LOG.TEXT", replacements: ["Picked up Sword"] },
} satisfies InternalLogAction

const flushPickupLog = () => {
  flushLogs([{ action, message: action.message }], true)
}

describe("log", () => {
  let game: Game
  const testEntities: Entity[] = []

  beforeEach(() => {
    game = createGame()
    game.dispatch({ type: InternalActionTypeEnum.INTERNAL_INIT })
    clearMobs(game)
    clearItems(game)
  })

  afterEach(() => {
    testEntities.splice(0).forEach(removeEntity)
    if (isIntegrityCheckEnabled()) {
      expectGameStateConsistent(game)
    }

    vi.restoreAllMocks()
  })

  const createNamedEntity = (name?: MessageKey): Entity => {
    const entity = TestLogEntity()
    if (name !== undefined) upsertComponents(entity, NameComponent({ name }))
    testEntities.push(entity)
    return entity
  }

  const projectSubject = (entity: Entity): EntityLogProjection => {
    const loggedAction = new Action(action)
    loggedAction.info("LOG.TEXT", getEntityLogProjection(entity))
    const projection =
      loggedAction.resolve().pendingLogs[0].message.replacements?.[0]
    if (typeof projection !== "object" || !("isPlayer" in projection))
      throw new Error("Missing entity projection")
    return projection
  }

  it("recognizes only the entity object present in the registry", () => {
    const entity = createNamedEntity("ENTITY.BOOMER")
    expect(isEntity(entity)).toBe(true)
    expect(isEntity({ ...entity })).toBe(false)
    expect(isEntity({ id: entity.id, name: "Boomer" })).toBe(false)
    removeEntity(entity)
    expect(isEntity(entity)).toBe(false)
  })

  it("keeps the translated name after the entity is removed", () => {
    const entity = createNamedEntity()
    upsertComponents(
      entity,
      NameComponent({ name: "ENTITY.SWORD" }),
      CursedComponent(),
    )
    const loggedAction = new Action(action)
    loggedAction.info("ITEM.PICKED_UP", getEntityName(entity))
    const message = loggedAction.resolve().pendingLogs[0].message
    expect(message.replacements).toEqual(["Cursed Sword"])
    removeEntity(entity)
    expect(formatLogMessage(message)).toBe("Picked up Cursed Sword")
  })

  it("localizes entity names and curses using the configured locale", async () => {
    const localized = createMessageFormatter(
      {
        en: EN_MESSAGES,
        pl: {
          ...EN_MESSAGES,
          ENTITY: {
            ...EN_MESSAGES.ENTITY,
            SWORD: "miecz",
            SHIELD: "tarcza",
            CURSED_NAME: "przeklęty {$name}",
          } satisfies Record<string, string>,
          ITEM: {
            ...EN_MESSAGES.ITEM,
            PICKED_UP: "Podniesiono {$arg0}",
            DROPPED_BY: "{$arg0} upuszcza {$arg1 :list}",
          } satisfies Record<string, string>,
        },
      },
      "en",
    )
    vi.spyOn(messages, "formatMessage").mockImplementation(
      (key, parameters, locale = LOCALE) => localized(key, parameters, locale),
    )
    vi.spyOn(
      await import("../../../utils/constants"),
      "LOCALE",
      "get",
    ).mockReturnValue("pl-PL")
    const sword = createNamedEntity()
    const shield = createNamedEntity()
    upsertComponents(
      sword,
      NameComponent({ name: "ENTITY.SWORD" }),
      CursedComponent(),
    )
    upsertComponents(shield, NameComponent({ name: "ENTITY.SHIELD" }))
    const message: LogMessage = {
      key: "ITEM.PICKED_UP",
      replacements: [getEntityName(sword)],
    }
    expect(formatLogMessage(message, "pl-PL")).toBe(
      "Podniesiono przeklęty miecz",
    )
    expect(formatLogMessage(message, "en")).toBe("Picked up przeklęty miecz")
    expect(
      formatLogMessage(
        {
          key: "ITEM.DROPPED_BY",
          replacements: [
            "Boomer",
            [getEntityName(sword), getEntityName(shield)],
          ],
        },
        "pl",
      ),
    ).toBe("Boomer upuszcza przeklęty miecz i tarcza")
    expect(
      formatLogMessage(
        { key: "INSPECT.ITEM", replacements: [getEntityLogProjection(sword)] },
        "pl",
      ),
    ).toBe("przeklęty miecz")
  })

  it("renders a missing name through the dictionary", () => {
    expect(
      formatLogMessage({ key: "LOG.TEXT", replacements: [getEntityName()] }),
    ).toBe("???")
  })

  it("passes the unified entity projection to the renderer", () => {
    const player = getPlayer()
    game.dispatch({
      type: InternalActionTypeEnum.INTERNAL_LOG,
      message: {
        key: "LOG.TEXT",
        replacements: [projectSubject(player)],
      },
    })
    const entry = getGameViewModel().logs.at(-1)!
    expect(entry.message.replacements?.[0]).toMatchObject({
      name: "You",
      isPlayer: true,
    })
  })

  it("renders the player without a third-person verb suffix", () => {
    expect(
      formatLogMessage({
        key: "ATTACK.HIT",
        replacements: [
          projectSubject(getPlayer()),
          getEntityName(createNamedEntity("ENTITY.BOOMER")),
          3,
        ],
      }),
    ).toBe("You hit Boomer for 3 HP")
  })

  it("renders another entity with a third-person verb suffix", () => {
    expect(
      formatLogMessage({
        key: "ATTACK.HIT",
        replacements: [
          projectSubject(createNamedEntity("ENTITY.BOOMER")),
          getEntityName(getPlayer()),
          3,
        ],
      }),
    ).toBe("Boomer hits You for 3 HP")
  })

  it("does not interpret tokens inside replacement values", () => {
    expect(
      formatLogMessage({
        key: "ITEM.MOVED",
        replacements: ["{$arg0}", "{hit|hits}"],
      }),
    ).toBe("Moved {$arg0} to {hit|hits}")
  })

  it("retains entity data after its components are removed", () => {
    const entity = createNamedEntity("ENTITY.BOOMER")
    const loggedAction = new Action(action)
    loggedAction.info("ENTITY.DIED", getEntityLogProjection(entity))
    removeEntity(entity)
    expect(
      formatLogMessage(loggedAction.resolve().pendingLogs[0].message),
    ).toBe("Boomer died")
  })

  it("retains the name recorded before a later change", () => {
    const entity = createNamedEntity("ENTITY.BOOMER")
    const message: LogMessage = {
      key: "LOG.TEXT",
      replacements: [getEntityName(entity)],
    }
    const name = entity.componentByType
      .get(NameComponent.type)!
      .values()
      .next().value!
    Object.assign(name, { name: "ENTITY.AXE" })
    expect(getEntityName(entity)).toBe("Axe")
    expect(formatLogMessage(message)).toBe("Boomer")
  })

  it("stacks equivalent object messages created separately", () => {
    const message: LogMessage = { key: "LOG.TEXT", replacements: ["Sword"] }
    game.state.log = []
    flushLogs(
      [
        {
          action,
          message: {
            ...message,
            replacements: [...(message.replacements ?? [])],
          },
        },
      ],
      true,
    )
    game.state.turn++
    flushLogs(
      [
        {
          action,
          message: {
            ...message,
            replacements: [...(message.replacements ?? [])],
          },
        },
      ],
      true,
    )
    expect(game.state.log).toHaveLength(1)
    expect(game.state.log[0].count).toBe(2)
  })

  it("keeps different replacement values separate", () => {
    game.state.log = []
    flushLogs(
      [{ action, message: { key: "LOG.TEXT", replacements: ["Sword"] } }],
      true,
    )
    flushLogs(
      [{ action, message: { key: "LOG.TEXT", replacements: ["Axe"] } }],
      true,
    )
    expect(game.state.log).toHaveLength(2)
  })

  it("renders a name list using the message locale", () => {
    expect(
      formatLogMessage({
        key: "ITEM.DROPPED_BY",
        replacements: ["You", ["Sword", "Axe"]],
      }),
    ).toBe("You dropped Sword and Axe")
  })

  it("renders an inspection from its projected data", () => {
    const message: LogMessage = {
      key: "INSPECT.ITEM",
      replacements: [projectSubject(createNamedEntity("ENTITY.SWORD"))],
    }
    expect(formatLogMessage(message)).toBe("Sword")
  })

  it("formats all optional inspection sections from projected data", () => {
    const projection: EntityLogProjection = {
      name: "Backpack",
      isPlayer: false,
      description: "A sturdy bag",
      container: {
        size: 0,
        depth: 1,
        contents: {
          baseDmg: { min: 2, max: 4 },
          dmg: { min: 3, max: 6 },
          dmgMul: 1.5,
          def: 0,
          defToDmgMul: 0,
        },
      },
      dmg: { min: 3, max: 6 },
      def: 0,
      bonusDmgMul: 0,
    }
    expect(
      formatLogMessage({ key: "INSPECT.ITEM", replacements: [projection] }),
    ).toBe(
      "Backpack. A sturdy bag. 0 SIZE. 1 DEPTH. 3-6 DMG. Contents: 3-6 DMG (2-4x1.5 + 0x0 from DEF). 0 DEF. Equip: x0 DMG",
    )
  })

  it("projects effective DMG and DEF before item and slot data are removed", () => {
    const item = createNamedEntity("ENTITY.SWORD")
    const slot = createNamedEntity("ENTITY.MAIN_HAND_SLOT")
    for (const [entity, component] of [
      [item, DmgComponent({ min: 2, max: 4 })],
      [item, DefComponent({ def: 3 })],
      [slot, DmgMulComponent({ dmgMul: 2 })],
      [slot, DefMulComponent({ defMul: 3 })],
    ] as const) {
      entity.componentById.set(component.id, component)
      entity.componentByType.set(
        component.type,
        new Map([[component.id, component]]),
      )
    }
    upsertRoleEntities(getPlayer(), { [EntityRoleEnum.EQ]: slot })
    upsertRoleEntities(slot, { [EntityRoleEnum.ITEM]: item })
    const projection = projectSubject(item)
    removeEntity(item)
    removeEntity(slot)
    expect(projection).toEqual({
      name: "Sword",
      isPlayer: false,
      description: "",
      dmg: { min: 4, max: 8 },
      def: 9,
    })
    expect(
      formatLogMessage({ key: "INSPECT.ITEM", replacements: [projection] }),
    ).toBe("Sword. 4-8 DMG. 9 DEF")
  })

  it("preserves projected rest arguments and the order of numeric replacements", () => {
    const loggedAction = new Action(action)
    loggedAction.info("BLEED.DAMAGE", getEntityLogProjection(getPlayer()), 3)
    const message = loggedAction.resolve().pendingLogs[0].message
    expect(message.replacements).toEqual([
      expect.objectContaining({
        name: "You",
        isPlayer: true,
        description: expect.any(String),
      }),
      3,
    ])
    expect(formatLogMessage(message)).toBe("You bleed for 3 HP")
  })

  it("keeps equal arguments with different message keys separate", () => {
    game.state.log = []
    flushLogs(
      [{ action, message: { key: "LOG.TEXT", replacements: ["Sword"] } }],
      true,
    )
    flushLogs(
      [{ action, message: { key: "ITEM.DROPPED", replacements: ["Sword"] } }],
      true,
    )
    expect(game.state.log).toHaveLength(2)
  })

  it("keeps structured projections in the log until rendering", () => {
    const loggedAction = new Action(action)
    loggedAction.info("BLEED.DAMAGE", getEntityLogProjection(getPlayer()), 1000)
    const message = loggedAction.resolve().pendingLogs[0].message
    expect(message).toEqual({
      key: "BLEED.DAMAGE",
      replacements: [
        expect.objectContaining({
          name: "You",
          isPlayer: true,
          description: expect.any(String),
        }),
        1000,
      ],
    })
    expect(formatLogMessage(message)).toBe("You bleed for 1000 HP")
    expect(message.replacements?.[1]).toBe(1000)
  })

  it("uses the same projection for ordinary and inspection logs", () => {
    const entity = createNamedEntity("ENTITY.SWORD")
    const loggedAction = new Action(action)
    loggedAction.info("ENTITY.DIED", getEntityLogProjection(entity))
    loggedAction.info("INSPECT.ITEM", getEntityLogProjection(entity))
    const [ordinary, inspection] = loggedAction.resolve().pendingLogs
    expect(ordinary.message.replacements).toEqual(
      inspection.message.replacements,
    )
    expect(ordinary.message.replacements?.[0]).not.toHaveProperty(
      "componentById",
    )
    expect(formatLogMessage(ordinary.message)).toBe("Sword died")
    expect(formatLogMessage(inspection.message)).toBe("Sword")
  })

  it("uses an empty slot description from the same entity projection", () => {
    const slot = createNamedEntity("ENTITY.MAIN_HAND_SLOT")
    upsertComponents(
      slot,
      InspectDescComponent({ text: "An empty hand", times: 0 }),
    )
    const loggedAction = new Action(action)
    loggedAction.info("INSPECT.EMPTY_SLOT", getEntityLogProjection(slot))
    expect(
      formatLogMessage(loggedAction.resolve().pendingLogs[0].message),
    ).toBe("An empty hand")
  })

  it("falls back to the empty slot name when its projection has no description", () => {
    const loggedAction = new Action(action)
    loggedAction.info(
      "INSPECT.EMPTY_SLOT",
      getEntityLogProjection(createNamedEntity("ENTITY.MAIN_HAND_SLOT")),
    )
    expect(
      formatLogMessage(loggedAction.resolve().pendingLogs[0].message),
    ).toBe("Main Hand slot is empty")
  })

  it("records a turn cost for success without a message", () => {
    const loggedAction = new Action(action)
    loggedAction.success()
    expect(loggedAction.resolve().consumesTurn).toBe(true)
    expect(loggedAction.resolve().pendingLogs).toEqual([])
  })

  it("allows an explicit free resolution to override a success", () => {
    const loggedAction = new Action(action)
    loggedAction.success("LOG.TEXT", "Done")
    expect(loggedAction.resolve(false).consumesTurn).toBe(false)
  })

  it("stacks identical messages from consecutive turns", () => {
    game.state.turn = 59
    flushPickupLog()

    game.state.turn = 60
    flushPickupLog()

    expect(
      game.state.log.filter(
        ({ action: logAction }) =>
          logAction.type === InternalActionTypeEnum.INTERNAL_LOG,
      ),
    ).toMatchObject([
      {
        message: { key: "LOG.TEXT", replacements: ["Picked up Sword"] },
        startTurn: 60,
        endTurn: 61,
        count: 2,
      },
    ])
  })

  it("keeps identical messages separate when turns occurred between them", () => {
    game.state.turn = 59
    flushPickupLog()

    game.state.turn = 63
    flushPickupLog()

    expect(
      game.state.log.filter(
        ({ action: logAction }) =>
          logAction.type === InternalActionTypeEnum.INTERNAL_LOG,
      ),
    ).toMatchObject([
      {
        message: { key: "LOG.TEXT", replacements: ["Picked up Sword"] },
        startTurn: 60,
        endTurn: 60,
        count: 1,
      },
      {
        message: { key: "LOG.TEXT", replacements: ["Picked up Sword"] },
        startTurn: 64,
        endTurn: 64,
        count: 1,
      },
    ])
  })
})
