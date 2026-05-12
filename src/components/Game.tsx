import React from "react";
import { useKeyboardControls } from "../game/hooks/useKeyboardControls";
import { Log } from "./Log";
import { Map } from "./Map";
import { Inv } from "./inventory/inv/Inv";
import { Exp } from "./Exp";
import { EQ } from "./inventory/Eq";

export const Game: React.FC = () => {
  useKeyboardControls();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 900,
        backgroundColor: "black",
        padding: 16
      }}
    >
      <EQ />
      <div style={{ display: "flex", flexDirection: "row", marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "48px",
          }}
        >
          <Exp />
          <Map />
        </div>
        <Log />
      </div>
      <Inv />
    </div>
  );
};
