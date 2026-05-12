import React from "react";

type TileIndexProps = {
  index: number;
};

export const TileIndex: React.FC<TileIndexProps> = ({ index }) => {
  return (
    <div
      style={{
        width: 48,
        display: "flex",

        alignItems: "center",
        justifyContent: "center",
        color: 'gray'
      }}
    >
      {index}
    </div>
  );
};
