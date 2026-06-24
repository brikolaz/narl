import { Entity, type EntityProps } from "../../../core/ecs/Entity";
import { DEFAULT_APPEARANCE_COLOR } from "../../../utils";
import { AppearanceComponent } from "../components/display/AppearanceComponent";
import { ColorComponent } from "../components/display/ColorComponent";
import { GlyphComponent } from "../components/display/GlyphComponent";

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
            background: props?.background ?? DEFAULT_APPEARANCE_COLOR,
        });
        const color = new ColorComponent({
            color: "gray",
        });
        super({ components: [apperance, glyph, color] });
    }
}
