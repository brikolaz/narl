import type { Id } from "../../core/ecs/Id";
import { COLORS } from "../../utils/colors";
import { getId } from "../../utils/getId";


export type RenderedTileProps = {
  id?: Id;
  char?: string;
  background?: string;
  color?: string;
  position: number;
};

export class RenderedTile {
  static MISSING_GLYPH = "#" as const;

  id: Id;
  char: string | undefined;
  background: string | undefined;
  color: string = COLORS.DEFAULT;
  position = 0;

  constructor(props: RenderedTileProps) {
    Object.assign(this, props);
    this.id ??= getId();
  }
}
