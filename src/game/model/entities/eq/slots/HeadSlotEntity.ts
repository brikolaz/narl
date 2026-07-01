import { NameComponent } from "../../../components/display/NameComponent";
import { HeadComponent } from "../../../components/eq/HeadComponent";
import { EqSlotEntity } from "../EqSlotEntity";

export class HeadSlotEntity extends EqSlotEntity {
  constructor() {
    const name = new NameComponent({ name: "Head" });
    const head = new HeadComponent();
    super({ components: [head, name] });
  }
}
