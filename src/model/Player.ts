import { TileEntity } from "./Tile";
import type { Renderable } from "./Renderable";
import { INITIAL_PLAYER_POSITION } from "../constants";

export class PlayerEntity extends TileEntity implements Renderable {
    content = '@' as const;

    constructor() {
        super(INITIAL_PLAYER_POSITION);
    }
}