export type RenderedTileProps = {
  char: string;
  background: string;
  color: string;
  position: number;
};

export class RenderedTile implements RenderedTileProps {
  static DEFAULT_CHAR = "#";

  char = "";
  background = "";
  color = "";
  position = 0;

  constructor(props: RenderedTileProps) {
    Object.assign(this, props);
  }
}
