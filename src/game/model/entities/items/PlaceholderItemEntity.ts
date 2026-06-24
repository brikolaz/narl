import { PlaceholderComponent } from "../../components/containers/PlaceholderComponent";
import { ItemEntity } from "./ItemEntity";

export class PlaceholderEntity extends ItemEntity {
  constructor() {
    const placeholder = new PlaceholderComponent();
    super({
      components: [placeholder],
    });
  }
}
