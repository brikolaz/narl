import type { Entity } from "../../core/model/Entity"
import type { ComponentRegistryById } from "../../core/model/registry/componentRegistry"
import type { EntityRegistryById } from "../../core/model/registry/entityRegistry"
import { createEnum, type EnumType } from "../../utils/types/Enum"
import type { TimedAction } from "../systems/actions/timedActions/types"
import type { ActionLog, LogEntry } from "../systems/log/types"
import { generateSeed, type Seed } from "../systems/rng/seed"
import { createWorldRng, type WorldRng } from "../systems/rng/worldRng"

export type Tile = {
  floor: Entity
  items: Entity[]
  mobs: Entity[]
  position: number
}

export type WorldState = Tile[]

export type PlayerState = {
  player: Entity | undefined
  position: number
}

export const GameStatusEnum = createEnum(
  "INACTIVE",
  "ACTIVE",
  "PENDING_GAME_OVER",
  "GAME_OVER",
  "WIN",
)
type GameStatusEnum = EnumType<typeof GameStatusEnum>

export type DeathContext = Partial<{
  epitaph: string
  turn: number
}>

export type GameState = {
  readonly seed: Seed
  readonly rng: WorldRng
  status: GameStatusEnum
  world: WorldState
  turn: number
  log: LogEntry[]
  actionLog: ActionLog[]
  player: PlayerState
  entityRegistryById: EntityRegistryById
  componentRegistryById: ComponentRegistryById
  timedActions: TimedAction[]
  getId: () => number
  death: DeathContext
}

const createInitialState = (): GameState => {
  const entityRegistryById: EntityRegistryById = {}
  const componentRegistryById: ComponentRegistryById = {}
  const seed = generateSeed()
  let id = 0

  const state: GameState = {
    seed,
    rng: createWorldRng(seed),
    status: GameStatusEnum.INACTIVE,
    world: [],
    turn: 0,
    log: [],
    actionLog: [],

    get entityRegistryById() {
      return entityRegistryById
    },
    get componentRegistryById() {
      return componentRegistryById
    },
    timedActions: [],
    getId() {
      return id++
    },
    death: {},
    player: {
      player: undefined,
      position: 0,
    },
  }

  return state
}

export let STATE: GameState

export const initState = (): GameState => {
  const initialState = createInitialState()

  if (!STATE) {
    STATE = initialState
    return STATE
  }

  return Object.defineProperties(
    STATE,
    Object.getOwnPropertyDescriptors(initialState),
  )
}
