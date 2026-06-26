import { useContext } from "react";
import { GameContext } from "../state/context";
import type { LogEntry } from "../systems/log/types";
import { MAX_VISIBLE_LOGS } from "../../utils/constants";

type Logs = {
  visibleLogs: LogEntry[];
};

export const useLogs = (): Logs => {
  const { gameState } = useContext(GameContext);
  const visibleLogs = gameState.log
    .slice(0, MAX_VISIBLE_LOGS)
    .reduce<LogEntry[]>((logs, log) => {
      logs.push(log);
      return logs;
    }, []);

  return { visibleLogs };
};
