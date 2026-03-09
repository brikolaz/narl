import { Entity } from "./base/Entity";
import type { Renderable } from "./Renderable";

export class TileEntity extends Entity implements Renderable {
    position;

    constructor(position: number) {
        super();
        this.position = position;
    }
}