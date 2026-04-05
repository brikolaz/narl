import { Component } from "../../../core/ecs/Component";
import { DEFAULT_BACKPACK_SIZE } from "../../../utils/constants";

export type SizeComponentProps = {
    size: number;
}

export class SizeComponent extends Component {
    size: number = DEFAULT_BACKPACK_SIZE;
    
    constructor(props: SizeComponentProps) {
        super();
        Object.assign(this, props);
    }
}
