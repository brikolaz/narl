import { Entity, type EntityProps } from "../../../../core/ecs/Entity";
import { ContainerComponent } from "../../components/containers/ContainerComponent";
import { EqSlotComponent } from "../../components/eq/EqSlotComponent";
import { PlaceholderEntity } from "../items/PlaceholderItemEntity";

type EqSlotEntityProps = EntityProps;

export abstract class EqSlotEntity extends Entity {
  constructor(props: EqSlotEntityProps) {
    const eqSlot = new EqSlotComponent();
    const container = new ContainerComponent();
    const placeholder = new PlaceholderEntity()
    super({
      entities: [...props?.entities ?? [], placeholder],
      components: [...(props?.components ?? []), eqSlot, container],
    });
  }
}
