import { useContext } from "react";
import { GameContext } from "../state/context";
import { MAX_VISIBLE_LOG } from "../../utils";
import type { LogEntry } from "../systems/log/types";

type Logs = {
  visibleLogs: LogEntry[];
};

export const useLogs = (): Logs => {
  const { gameState } = useContext(GameContext);
  const visibleLogs = gameState.log
    .slice(0, MAX_VISIBLE_LOG)
    .reduce<LogEntry[]>((logs, log) => {
      logs.push(log);
      return logs;
    }, []);
console.log(visibleLogs)
  return { visibleLogs };
};
