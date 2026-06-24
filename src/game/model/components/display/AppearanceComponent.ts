import { Component } from "../../../../core/ecs/Component";
import { DEFAULT_APPEARANCE_COLOR } from "../../../../utils";

export type AppearanceComponentProps = {
    background: string;
}

export class AppearanceComponent extends Component {
    background: string = DEFAULT_APPEARANCE_COLOR;

    constructor(props: AppearanceComponentProps) {
        super();
        Object.assign(this, props);
    }
}
