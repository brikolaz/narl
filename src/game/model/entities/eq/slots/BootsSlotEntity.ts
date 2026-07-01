import { NameComponent } from "../../../components/display/NameComponent";
import { BootsComponent } from "../../../components/eq/BootsComponent";
import { EqSlotEntity } from "../EqSlotEntity";

export class BootsSlotEntity extends EqSlotEntity {
  constructor() {
    const name = new NameComponent({ name: "Boots" });
    const boots = new BootsComponent();
    super({ components: [boots, name] });
  }
}
