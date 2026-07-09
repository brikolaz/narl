import type { Entity } from "../../core/ecs/Entity";
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

export const getInitialState = (): GameState =>
  ({ initialized: false }) as GameState;
