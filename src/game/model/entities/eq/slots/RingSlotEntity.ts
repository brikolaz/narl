import { NameComponent } from "../../../components/display/NameComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import { EqSlotEntity } from "../EqSlotEntity";

export class RingSlotEntity extends EqSlotEntity {
  constructor() {
    const name = new NameComponent({ name: "Ring" });
    const ring1 = new RingComponent();
    super({ components: [ring1, name] });
  }
}
