import { getEntityCreator, type Entity } from "../../core/ecs/Entity";
import { type ComponentRegistryById } from "../../core/ecs/registry/componentRegistry";
import { type EntityRegistryById } from "../../core/ecs/registry/entityRegistry";
import type { TimedEffect } from "../systems/effects/types";
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
  timedEffects: TimedEffect[]
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
    timedEffects: [],
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
