import { Component } from "../../../core/ecs/Component";

export type GlyphComponentProps = {
    glyph: string;
    color?: string;
}

export class GlyphComponent extends Component {
    glyph: string = '';
    color: string = '#FFFFFF'

    constructor(props: GlyphComponentProps) {
        super();
        Object.assign(this, {
            glyph: props.glyph,
            color: props.color ?? this.color,
        });
    }
}