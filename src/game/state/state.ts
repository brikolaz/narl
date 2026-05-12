import { INITIAL_TURN } from "../../utils/constants";
import { FloorEntity } from "../model/entities/FloorEntity";
import { ItemEntity } from "../model/entities/items/ItemEntity";
import type { MobEntity } from "../model/entities/mobs/MobEntity";
import { PlayerEntity } from "../model/entities/PlayerEntity";
import { initWorld } from "../systems/init";
import type { LogEntry } from "../systems/log";

export type Tile = {
  floor: FloorEntity;
  player?: PlayerEntity;
  items: ItemEntity[];
  mobs: MobEntity[];
};

export type WorldState = Tile[];

export type GameState = {
  world: WorldState;
  turn: number;
  log: LogEntry[];
};

export const getInitialState = (): GameState => ({
  world: initWorld(),
  turn: INITIAL_TURN,
  log: [
    {
      turn: 1,
      message: "You'd rather stay dead",
    },
  ],
});
