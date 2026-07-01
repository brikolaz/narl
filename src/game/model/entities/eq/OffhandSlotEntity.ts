import { NameComponent } from "../../components/display/NameComponent";
import { OffhandComponent } from "../../components/eq/OffhandComponent";
import { EqSlotEntity } from "./EqSlotEntity";

export class OffhandSlotEntity extends EqSlotEntity {
  constructor() {
    const name = new NameComponent({ name: "Offhand" });
    const offhand = new OffhandComponent();
    super({ components: [offhand, name] });
  }
}
