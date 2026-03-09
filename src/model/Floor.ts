import { Entity } from "./base/Entity";
import type { Renderable } from "./Renderable";

export class FloorEntity extends Entity implements Renderable {
    content = '' as const;
    position;

    constructor(position: number) {
        super()
        this.position = position;
    }
}