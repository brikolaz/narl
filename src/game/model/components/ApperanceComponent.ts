import { Component } from "../../../core/ecs/Component";

export type ApperanceComponentProps = {
    background: string;
}

export class ApperanceComponent extends Component {
    background: string = '#000000';

    constructor(props: ApperanceComponentProps) {
        super();
        Object.assign(this, props);
    }
}
