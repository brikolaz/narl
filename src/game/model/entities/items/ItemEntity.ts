import { Entity, type EntityProps } from "../../../../core/ecs/Entity";
import { ColorComponent } from "../../components/ColorComponent";

export class ItemEntity extends Entity {
  constructor(props: EntityProps) {
    const color = new ColorComponent();
    super({
      ...props,
      components: [...(props.components ?? []), color],
    });
  }
}
