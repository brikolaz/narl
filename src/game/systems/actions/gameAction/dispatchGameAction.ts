import { STATE, type GameState } from "../../../state/state";
import { applyEffect } from "../../effects/applyEffect";
import { flushLogs, recordPlayerAction } from "../../log/log";
import type { PendingLog } from "../../log/types";
import { isPlayerAction } from "../../player/guards";
import { increaseTurn } from "../../turn/turn";
import { runWorldTurn } from "../../world/turn/runWorldTurn";
import type { ActionResolution, GameAction } from "../types";
import { resolveGameAction } from "./resolveGameAction";

const drainResolution = (
  action: GameAction,
  resolution: ActionResolution,
  pendingLogs: PendingLog[],
): { consumesTurn: boolean } => {
  let consumesTurn = resolution.consumesTurn;

  pendingLogs.push(...resolution.pendingLogs);

  let effectIndex = 0;

  while (effectIndex < resolution.pendingEffects.length) {
    const effect = resolution.pendingEffects[effectIndex];
    const effectResolution = applyEffect(action, effect);

    const effectResult = drainResolution(
      action,
      effectResolution,
      pendingLogs,
    );

    consumesTurn ||= effectResult.consumesTurn;
    effectIndex++;
  }

  let actionIndex = 0;

  while (actionIndex < resolution.pendingActions.length) {
    const pendingAction = resolution.pendingActions[actionIndex];

    const actionResult = drainAction(
      pendingAction,
      pendingLogs,
    );

    consumesTurn ||= actionResult.consumesTurn;
    actionIndex++;
  }

  return { consumesTurn };
};

const drainAction = (
  action: GameAction,
  pendingLogs: PendingLog[],
): { consumesTurn: boolean } => {
  const resolution = resolveGameAction(action);

  return drainResolution(
    action,
    resolution,
    pendingLogs,
  );
};

export const dispatchGameAction = (
  action: GameAction,
): GameState => {
  let consumesTurn = false;
  const pendingLogs: PendingLog[] = [];

  if (isPlayerAction(action)) {
    recordPlayerAction(action);
  }

  const actionResult = drainAction(
    action,
    pendingLogs,
  );

  consumesTurn ||= actionResult.consumesTurn;

  if (consumesTurn) {
    const worldActions = runWorldTurn();

    for (const worldAction of worldActions) {
      const worldResult = drainAction(
        worldAction,
        pendingLogs,
      );

      consumesTurn ||= worldResult.consumesTurn;
    }
  }

  flushLogs(pendingLogs, consumesTurn);

  STATE.turn = consumesTurn
    ? increaseTurn(STATE.turn)
    : STATE.turn;

  return STATE;
};