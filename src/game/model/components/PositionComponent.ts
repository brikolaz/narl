import { Component } from "../../../core/ecs/Component";

export type PositionComponentProps = {
    position: number;
}

export class PositionComponent extends Component {
    position: number = 0;

    constructor(props: PositionComponentProps) {
        super();
        Object.assign(this, props);
    }
}