import React from "react";
import { TileIndex } from "./TileIndex";
import type { RenderedTile } from "../game/systems/render/types";

type TileProps = {
  renderedTile: RenderedTile;
  isFirst: boolean;
  isLast: boolean;
};

const OUTER_BORDER_COLOR = "gray";
const INNER_BORDER_COLOR = "#a0a0a0";
const INNER_BORDER_STYLE = "solid";

const Tile: React.FC<TileProps> = ({ renderedTile, isFirst, isLast }) => {
  return (
    <div>
      <div
        style={{
          backgroundColor: renderedTile.background ?? "black",
          height: "48px",
          width: "48px",
          boxSizing: "border-box",
          borderTop: `1px solid ${OUTER_BORDER_COLOR}`,
          borderRight: isLast
            ? `1px solid ${OUTER_BORDER_COLOR}`
            : `1px ${INNER_BORDER_STYLE} ${INNER_BORDER_COLOR}`,
          borderBottom: `1px solid ${OUTER_BORDER_COLOR}`,
          borderLeft: isFirst ? `1px solid ${OUTER_BORDER_COLOR}` : undefined,
          color: renderedTile.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4
        }}
      >
        {renderedTile.char ?? " "}
      </div>
      <TileIndex index={renderedTile.position + 1} />
    </div>
  );
};

export default Tile;
