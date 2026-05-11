import { Component } from "../../../core/ecs/Component";

export type GlyphComponentProps = {
    glyph: string;
}

export class GlyphComponent extends Component {
    glyph: string = '';

    constructor(props: GlyphComponentProps) {
        super();
        Object.assign(this, {
            glyph: props.glyph,
        });
    }
}