export type RenderedTileProps = {
  char: string;
  background: string;
  color: string;
  position: number;
};

export class RenderedTile {
  static DEFAULT_CHAR = '#'

  constructor(props: RenderedTileProps) {
    Object.assign(this, props);
  }
}
