import React from "react";
import { useKeyboardControls } from "../game/hooks/useKeyboardControls";
import { Exp } from "./Exp";
import { Log } from "./Log";
import { Map } from "./Map";
import { EQ } from "./inventory/Eq";
import { Inv } from "./inventory/inv/Inv";
import { PlayerStats } from "./PlayerStats";
import { EqStats } from "./EqStats";

export const Game: React.FC = () => {
  useKeyboardControls();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 1000,
        backgroundColor: "black",
        padding: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <EQ />
        <div style={{ marginLeft: 16, display: 'flex' }}>
          <EqStats />
          <PlayerStats />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 16,
          marginRight: 16,
        }}
      >
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
        <div style={{ marginLeft: 16 }}>
          <Log />
        </div>
      </div>
      <Inv />
    </div>
  );
};
