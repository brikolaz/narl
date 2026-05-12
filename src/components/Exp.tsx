import React from "react";
import { usePlayer } from "../game/hooks/usePlayer";

export const Exp: React.FC = () => {
  const { exp } = usePlayer();

  return (
    <div
      style={{
        display: "flex",
        marginRight: 5,
        width: 100,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {exp}xp
    </div>
  );
};
