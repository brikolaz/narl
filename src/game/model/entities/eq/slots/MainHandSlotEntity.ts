import { NameComponent } from "../../../components/display/NameComponent";
import { MainHandComponent } from "../../../components/eq/MainHandComponent";
import { EqSlotEntity } from "../EqSlotEntity";

export class MainHandSlotEntity extends EqSlotEntity {
  constructor() {
    const name = new NameComponent({ name: "Main Hand" });
    const mainHand = new MainHandComponent();
    super({ components: [mainHand, name] });
  }
}
