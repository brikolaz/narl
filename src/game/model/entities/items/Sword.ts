import type { EntityProps } from "../../../../core/ecs/Entity";
import { GlyphComponent } from "../../components/GlyphComponent";
import { ItemEntity } from "./ItemEntity";

export type SwordEntityProps = EntityProps;

export class SwordEntity extends ItemEntity {
    constructor(props?: SwordEntityProps) {
        const glyph = new GlyphComponent({
            glyph: '/' as string,
        });

        super({ ...props, components: [...(props?.components ?? []), glyph] });
    }
}