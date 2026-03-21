import { INITIAL_PLAYER_POSITION, MAP_SIZE } from "../../utils/constants";
import { getDummyArray } from "../../utils/getDummyArray";
import { FloorEntity } from "../model/entities/FloorEntity";
import { ItemEntity } from "../model/entities/items/ItemEntity";
import { SwordEntity } from "../model/entities/items/Sword";
import { PlayerEntity } from "../model/entities/PlayerEntity";

export type GameState = {
    tiles: FloorEntity[];
    player: PlayerEntity;
    turn: number;
    items: ItemEntity[]
}

export const getInitialState = (): GameState => ({
    tiles: getDummyArray(MAP_SIZE).map((_, position) => new FloorEntity({ position })),
    player: new PlayerEntity({ position: INITIAL_PLAYER_POSITION }),
    turn: 0,
    items: [new SwordEntity({ position: 3 })],
})