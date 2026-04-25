import { Entity, type EntityProps } from "../../../core/ecs/Entity";
import { AppearanceComponent } from "../components/AppearanceComponent";
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
        const apperance = new AppearanceComponent({
            background: props?.background ?? '#000000',
        });
        super({ components: [apperance, glyph] });
    }
}
