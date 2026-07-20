import { getEntityCreator, type Entity } from "../../core/ecs/Entity";
import type { Id } from "../../core/ecs/Id";
import { type ComponentRegistryById } from "../../core/ecs/registry/componentRegistry";
import { type EntityRegistryById } from "../../core/ecs/registry/entityRegistry";
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
};

export let ENTITY_REGISTRY_BY_ID: EntityRegistryById = {};
export let COMPONENT_REGISTRY_BY_ID: ComponentRegistryById = {};
let ID = 0;
export const getId = (): Id => ++ID;

export const getInitialState = (): GameState => {
  ENTITY_REGISTRY_BY_ID = {};
  COMPONENT_REGISTRY_BY_ID = {};
  ID = 0;

  return {
    initialized: false,
    world: [],
    turn: 0,
    log: [],
    actionLog: [],
    player: {
      player: getEntityCreator("DUMMY")(),
      position: 0,
    },

    get entityRegistryById() {
      return ENTITY_REGISTRY_BY_ID;
    },

    get componentRegistryById() {
      return COMPONENT_REGISTRY_BY_ID;
    },
  };
};
