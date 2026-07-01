import { NameComponent } from "../../../components/display/NameComponent";
import { ArmorComponent } from "../../../components/eq/ArmorComponent";
import { EqSlotEntity } from "../EqSlotEntity";

export class ArmorSlotEntity extends EqSlotEntity {
  constructor() {
    const name = new NameComponent({ name: "Armor" });
    const armor = new ArmorComponent();
    super({ components: [armor, name] });
  }
}
