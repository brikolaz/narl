import React from "react";
import type { RenderedTile } from "../game/systems/render";

type TileProps = {
  renderedTile: RenderedTile;
};

const Tile: React.FC<TileProps> = ({ renderedTile }) => {
  return (
    <div
      style={{
        backgroundColor: renderedTile.background ?? "black",
        height: "48px",
        width: "48px",
        border: "1px solid white",
        color: renderedTile.color,
      }}
    >
      {renderedTile.char ?? " "}
    </div>
  );
};

export default Tile;
