import type { Id } from "../../../../core/model/Id";
import { STATE } from "../../../state/state";
import { resolveGameAction } from "../gameAction/resolveGameAction";
import type { ActionResolution } from "../types";
import type { TimedAction } from "./types";

const enqueueTimedAction = (pendingAction: TimedAction): void => {
  if (pendingAction.duration === undefined) {
    throw new Error("Can't schedule actions with no delay");
  }
  STATE.timedActions.push(pendingAction);
};

export const applyTimedAction = (
  pendingAction: TimedAction,
): ActionResolution | undefined => {
  if (pendingAction.delay > 0) {
    enqueueTimedAction(pendingAction);
    return;
  }

  const actionResolution = resolveGameAction(pendingAction.action);

  if (pendingAction.duration <= 1) {
    return actionResolution;
  }

  enqueueTimedAction({
    ...pendingAction,
    duration: pendingAction.duration - 1,
  });

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

      const { delay, duration } = timedAction;

      if (delay > 1) {
        return {
          ...timedAction,
          delay: delay - 1,
        };
      }

      actionsToApply.push(timedAction);

      if (duration > 0) {
        return {
          ...timedAction,
          delay,
          duration: duration - 1,
        };
      }
      return undefined;
    })
    .filter((timedAction) => timedAction !== undefined);

  return actionsToApply;
};
