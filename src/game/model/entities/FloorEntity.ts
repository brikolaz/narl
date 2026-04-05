import { Entity, type EntityProps } from "../../../core/ecs/Entity";
import { ApperanceComponent } from "../components/ApperanceComponent";
import { GlyphComponent } from "../components/GlyphComponent";

export type FloorEntityProps = {
    background?: string;
    glyph?: string;
} & EntityProps;

export class FloorEntity extends Entity {
    constructor(props?: FloorEntityProps) {
        const glyph = new GlyphComponent({
            glyph: props?.glyph ?? '.' as string,
        });
        const apperance = new ApperanceComponent({
            background: props?.background ?? '#000000',
        });
        super({ components: [apperance, glyph] });
    }
}
