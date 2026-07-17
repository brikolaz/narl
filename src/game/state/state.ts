import { getEntityCreator, type Entity } from "../../core/ecs/Entity";
import {
  type ComponentRegistryById,
} from "../../core/ecs/registry/componentRegistry";
import {
  type EntityRegistryById,
} from "../../core/ecs/registry/entityRegistry";
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
};

export let ENTITY_REGISTRY_BY_ID: EntityRegistryById = {};
export let COMPONENT_REGISTRY_BY_ID: ComponentRegistryById = {};

export const getInitialState = (): GameState => {
  ENTITY_REGISTRY_BY_ID = {};
  COMPONENT_REGISTRY_BY_ID = {};

  return {
    initialized: false,
    world: [],
    turn: 0,
    log: [],
    actionLog: [],
    player: {
      player: getEntityCreator("DUMMY")(), // todo: needs to be removed on init!
      position: 0,
    },
  };
};
