import { getEntityCreator, type Entity } from "../../core/ecs/Entity";
import {
  COMPONENT_REGISTRY_BY_ID,
  type ComponentRegistryById,
} from "../../core/ecs/registry/componentRegistry";
import {
  ENTITY_REGISTRY_BY_ID,
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
  registry: {
    entity: EntityRegistryById;
    component: ComponentRegistryById;
  };
};

export const getInitialState = (): GameState => ({
  initialized: false,
  world: [],
  turn: 0,
  log: [],
  actionLog: [],
  player: {
    player: getEntityCreator("DUMMY")(), // todo: needs to be removed on init!
    position: 0,
  },
  registry: {
    entity: ENTITY_REGISTRY_BY_ID,
    component: COMPONENT_REGISTRY_BY_ID,
  },
});
