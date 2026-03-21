import { GlyphComponent } from "../../components/GlyphComponent";
import { PositionComponent } from "../../components/PositionComponent";
import { ItemEntity } from "./ItemEntity";

export type SwordEntityProps = {
    position: number;
}

export class SwordEntity extends ItemEntity {
    constructor(props: SwordEntityProps) {
        const glyph = new GlyphComponent({
            glyph: '/' as string,
        });
        const position = new PositionComponent({
            position: props.position,
        });

        super({ components: [glyph, position] });
    }
}