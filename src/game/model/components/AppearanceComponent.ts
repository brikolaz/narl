import { Component } from "../../../core/ecs/Component";

export type AppearanceComponentProps = {
    background: string;
}

export class AppearanceComponent extends Component {
    background: string = '#000000';

    constructor(props: AppearanceComponentProps) {
        super();
        Object.assign(this, props);
    }
}
