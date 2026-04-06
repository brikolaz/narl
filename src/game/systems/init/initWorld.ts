import { INITIAL_PLAYER_POSITION, MAP_SIZE } from "../../../utils/constants";
import { getDummyArray } from "../../../utils/getDummyArray";
import { FloorEntity } from "../../model/entities/FloorEntity";
import { SwordEntity } from "../../model/entities/items/Sword";
import { PlayerEntity } from "../../model/entities/PlayerEntity";
import type { WorldState } from "../../state/state";

export const initWorld = (): WorldState => {
    const world: WorldState = getDummyArray(MAP_SIZE).map(() => ({
        floor: new FloorEntity(),
        player: undefined,
        items: [],
    }));
    world[INITIAL_PLAYER_POSITION].player = new PlayerEntity()
    world[3].items.push(new SwordEntity());

    return world;
}