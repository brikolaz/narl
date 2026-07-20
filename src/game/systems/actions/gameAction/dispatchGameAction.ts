import { STATE, type GameState } from "../../../state/state";
import { flushLogs, recordPlayerAction } from "../../log/log";
import type { PendingLog } from "../../log/types";
import { isPlayerAction } from "../../player/guards";
import { increaseTurn } from "../../turn/turn";
import { runWorldTurn } from "../../world/turn/runWorldTurn";
import type { GameAction } from "../types";
import { resolveGameAction } from "./resolveGameAction";

const drainAction = (
  action: GameAction,
  pendingLogs: PendingLog[],
): { consumesTurn: boolean } => {
  const resolution = resolveGameAction(action);

  let consumesTurn = resolution.consumesTurn;

  pendingLogs.push(...resolution.pendingLogs);

  for (const pendingAction of resolution.pendingActions) {
    const childResult = drainAction(pendingAction, pendingLogs);

    consumesTurn = consumesTurn || childResult.consumesTurn;
  }

  return { consumesTurn };
};

export const dispatchGameAction = (action: GameAction): GameState => {
  let consumesTurn = false;
  const pendingLogs: PendingLog[] = [];

  if (isPlayerAction(action)) {
    recordPlayerAction(action);
  }

  const actionResult = drainAction(action, pendingLogs);
  consumesTurn = consumesTurn || actionResult.consumesTurn;

  if (consumesTurn) {
    const worldActions = runWorldTurn();

    for (const worldAction of worldActions) {
      const worldResult = drainAction(worldAction, pendingLogs);
      consumesTurn = consumesTurn || worldResult.consumesTurn;
    }
  }

  flushLogs(pendingLogs, consumesTurn);
  STATE.turn = consumesTurn ? increaseTurn(STATE.turn) : STATE.turn;

  return STATE;
};
