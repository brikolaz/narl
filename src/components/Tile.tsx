import React from "react";
import type { RenderedTile } from "../game/systems/render";
import { TileIndex } from "./TileIndex";

type TileProps = {
  renderedTile: RenderedTile;
  index: number;
};

const Tile: React.FC<TileProps> = ({ renderedTile, index }) => {
  return (
    <div>
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
      <TileIndex index={index + 1} />
    </div>
  );
};

export default Tile;
