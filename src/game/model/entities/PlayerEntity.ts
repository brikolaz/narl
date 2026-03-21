
import { Entity } from "../../../core/ecs/Entity";
import { PLAYER_SIGN } from "../../../utils/constants";
import { GlyphComponent } from "../components/GlyphComponent";
import { PositionComponent } from "../components/PositionComponent";

export type PlayerEntityProps = {
    position: number;
};

export class PlayerEntity extends Entity {
    constructor(props: PlayerEntityProps) {
        const glyph = new GlyphComponent({
            glyph: PLAYER_SIGN as string,
        });
        const position = new PositionComponent({
            position: props.position,
        });
        super({ components: [glyph, position] });
    }
}