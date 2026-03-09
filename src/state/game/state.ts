import type { Unique } from "../../model/base/Unique";
import { FloorEntity } from "../../model/Floor";
import { PlayerEntity } from "../../model/Player";
import type { Renderable } from "../../model/Renderable";

export type Game = {
    tiles: (Renderable & Unique)[];
    player: (Renderable & Unique);
}

export const useInitialState = (): Game => ({
    tiles: [new FloorEntity(0), new FloorEntity(1), new FloorEntity(2), new FloorEntity(3), new FloorEntity(4), new FloorEntity(5), new FloorEntity(6), new FloorEntity(7)],
    player: new PlayerEntity()
})