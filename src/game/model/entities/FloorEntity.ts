import { Entity, type EntityProps } from "../../../core/ecs/Entity";
import { ApperanceComponent } from "../components/ApperanceComponent";
import { GlyphComponent } from "../components/GlyphComponent";
import { PositionComponent } from "../components/PositionComponent";

export type FloorEntityProps = {
    position: number;
    background?: string;
    glyph?: string;
} & EntityProps;

export class FloorEntity extends Entity {
    constructor(props: FloorEntityProps) {
        const glyph = new GlyphComponent({
            glyph: props.glyph ?? '.' as string,
        });
        const apperance = new ApperanceComponent({
            background: props.background ?? '#000000',
        });
        const position = new PositionComponent({
            position: props.position,
        });
        super({ components: [apperance, position, glyph] });
    }
}
