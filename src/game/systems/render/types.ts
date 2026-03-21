import { getId } from "../../../utils/getId";

export type RenderedTileProps = {
    id?: string;
    char?: string;
    background?: string;
}

export class RenderedTile {
    id: string;
    char: string | undefined;
    background: string | undefined;

    constructor(props: RenderedTileProps) {
        Object.assign(this, props);
        this.id ??= getId();
    }
}