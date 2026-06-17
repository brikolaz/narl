import { HeadComponent } from "../../components/eq/HeadComponent";
import { EqSlotEntity } from "./EqSlotEntity";

export class HeadSlotEntity extends EqSlotEntity {
  constructor() {
    const head = new HeadComponent();
    super({ components: [head] });
  }
}
