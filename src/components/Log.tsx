import React, { useContext } from "react";
import { GameContext } from "../game/state/context";
import { MAX_VISIBLE_LOG } from "../utils/constants";

export const Log: React.FC = () => {
  const { gameState } = useContext(GameContext);
  const visibleLog = gameState.log.slice(0, MAX_VISIBLE_LOG);

  return (
    <div style={{ width: 400, height: 120 }}>
      {visibleLog.map((entry, i) => (
        <div key={i}>{`[${entry.turn}] ${entry.message}`}</div>
      ))}
    </div>
  );
};
