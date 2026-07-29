import { getEntityCreator, type Entity } from "../../core/model/Entity";
import { type ComponentRegistryById } from "../../core/model/registry/componentRegistry";
import { type EntityRegistryById } from "../../core/model/registry/entityRegistry";
import type { TimedAction } from "../systems/actions/timedActions/types";
import type { ActionLog, LogEntry } from "../systems/log/types";

export type Tile = {
  floor: Entity;
  items: Entity[];
  mobs: Entity[];
  position: number;
};

export type WorldState = Tile[];

export type PlayerState = {
  player: Entity;
  position: number;
};

export type GameState = {
  initialized: boolean;
  world: WorldState;
  turn: number;
  log: LogEntry[];
  actionLog: ActionLog[];
  player: PlayerState;
  entityRegistryById: EntityRegistryById;
  componentRegistryById: ComponentRegistryById;
  timedActions: TimedAction[]
  getId: () => number;
};

export let STATE: GameState;

export const createInitialState = (): GameState => {
  const entityRegistryById: EntityRegistryById = {};
  const componentRegistryById: ComponentRegistryById = {};
  let id = 0;

  STATE = {
    initialized: false,
    world: [],
    turn: 0,
    log: [],
    actionLog: [],

    get entityRegistryById() {
      return entityRegistryById;
    },
    get componentRegistryById() {
      return componentRegistryById;
    },

    player: undefined as unknown as PlayerState,
    timedActions: [],
    getId() {
      return id++;
    },
  };

  STATE.player = {
    player: getEntityCreator("DUMMY")(),
    position: 0,
  };

  return STATE;
};
