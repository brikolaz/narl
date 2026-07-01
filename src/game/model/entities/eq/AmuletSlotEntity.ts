import { NameComponent } from "../../components/display/NameComponent";
import { AmuletComponent } from "../../components/eq/AmuletComponent";
import { EqSlotEntity } from "./EqSlotEntity";

export class AmuletSlotEntity extends EqSlotEntity {
  constructor() {
    const name = new NameComponent({ name: "Amulet" });
    const amulet = new AmuletComponent();
    super({ components: [amulet, name] });
  }
}
