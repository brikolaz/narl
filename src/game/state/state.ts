import { FloorEntity } from "../model/entities/FloorEntity";
import { ItemEntity } from "../model/entities/items/ItemEntity";
import { PlayerEntity } from "../model/entities/PlayerEntity";
import { initWorld } from "../systems/init/initWorld";
import type { LogEntry } from "../systems/log";

export type Tile = {
    floor: FloorEntity;
    player?: PlayerEntity;
    items: ItemEntity[];
}

export type WorldState = Tile[];

export type GameState = {
    world: WorldState;
    turn: number;
    log: LogEntry[];
}

export const getInitialState = (): GameState => ({
    world: initWorld(),
    turn: 0,
    log: []
})