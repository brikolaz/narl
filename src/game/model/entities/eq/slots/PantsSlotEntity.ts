import { NameComponent } from "../../../components/display/NameComponent";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import { EqSlotEntity } from "../EqSlotEntity";

export class PantsSlotEntity extends EqSlotEntity {
  constructor() {
    const name = new NameComponent({ name: "Pants" });
    const pants = new PantsComponent();
    const ring = new RingComponent();
    super({ components: [pants, name, ring] });
  }
}
