import React from "react";
import { useLogs } from "../game/hooks/useLogs";

export const Log: React.FC = () => {
  const { visibleLogs } = useLogs();

  return (
    <div style={{ width: 400, height: 120 }}>
      {visibleLogs.map((entry, i) => (
        <div key={i}>{`[${entry.turn}] ${entry.message}`}</div>
      ))}
    </div>
  );
};
