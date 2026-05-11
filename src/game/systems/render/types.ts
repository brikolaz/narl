import { COLORS } from "../../../utils/colors";
import { getId } from "../../../utils/getId";

export type RenderedTileProps = {
  id?: string;
  char?: string;
  background?: string;
  color?: string;
};

export class RenderedTile {
  id: string;
  char: string | undefined;
  background: string | undefined;
  color: string = COLORS.DEFAULT;

  constructor(props: RenderedTileProps) {
    Object.assign(this, props);
    this.id ??= getId();
  }
}
