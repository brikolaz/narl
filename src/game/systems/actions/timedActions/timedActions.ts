import type { Id } from "../../../../core/model/Id";
import { STATE } from "../../../state/state";
import { resolveGameAction } from "../gameAction/resolveGameAction";
import type { ActionResolution } from "../types";
import type { TimedAction } from "./types";

const enqueueTimedAction = (pendingAction: TimedAction): void => {
  if (pendingAction.turns === undefined) {
    throw new Error("Can't schedule actions with no delay");
  }
  STATE.timedActions.push(pendingAction);
};

export const applyTimedAction = (
  pendingAction: TimedAction,
): ActionResolution | undefined => {
  if (!pendingAction.immediate) {
    if (pendingAction.turns === 0) {
      return resolveGameAction(pendingAction.action);
    }
    enqueueTimedAction(pendingAction);
    return;
  }
  const actionResolution: ActionResolution = resolveGameAction(
    pendingAction.action,
  );
  if (pendingAction.turns === 0) {
    return actionResolution;
  }
  enqueueTimedAction({ ...pendingAction, turns: pendingAction.turns - 1 });
  return actionResolution;
};

export const dequeueTimedActions = (
  processedActions: Id[] = [],
): TimedAction[] => {
  const actionsToApply: TimedAction[] = [];
  STATE.timedActions = STATE.timedActions
    .map((timedAction) => {
      if (processedActions.includes(timedAction.id)) {
        return timedAction;
      }
      const { id, action, immediate, turns } = timedAction;
      if (immediate) {
        actionsToApply.push(timedAction);
        if (turns === 0) {
          return undefined;
        }
      } else if (turns === 0) {
        actionsToApply.push(timedAction);
        return undefined;
      }

      return {
        id,
        action,
        immediate,
        turns: turns - 1,
      };
    })
    .filter((timedAction) => timedAction !== undefined);

  return actionsToApply;
};
