import { beforeEach, describe, expect, it } from "vitest";
import { initState, STATE } from "../../../state/state";
import { Action } from "../action";
import { InternalActionType } from "../../internal/type";
import { applyTimedAction, dequeueTimedActions } from "./timedActions";

describe("applyTimedAction", () => {
  beforeEach(() => {
    initState();
  });

  const getImmediateAction = (duration: number, priority?: number) => {
    const action = new Action({
      type: InternalActionType.LOG,
      message: "source",
    });
    action.addPendingImmediateAction(
      { type: InternalActionType.LOG, message: "tick" },
      duration,
      priority,
    );
    return action.resolve().pendingActions[0];
  };

  const getDelayedAction = (priority: number) => {
    const action = new Action({
      type: InternalActionType.LOG,
      message: "source",
    });
    action.addPendingDelayedAction(
      { type: InternalActionType.LOG, message: `${priority}` },
      1,
      1,
      priority,
    );
    return action.resolve().pendingActions[0];
  };

  it("queues the remaining execution when duration is two", () => {
    applyTimedAction(getImmediateAction(2));

    expect(STATE.timedActions).toHaveLength(1);
    expect(STATE.timedActions[0]?.duration).toBe(0);
  });

  it("does not queue another execution when duration is one", () => {
    applyTimedAction(getImmediateAction(1));

    expect(STATE.timedActions).toHaveLength(0);
  });

  it("assigns zero priority by default", () => {
    expect(getImmediateAction(1)?.priority).toBe(0);
  });

  it("dequeues timed actions from highest to lowest priority", () => {
    for (const priority of [0, 10, -5, 10]) {
      applyTimedAction(getDelayedAction(priority));
    }

    expect(dequeueTimedActions().map(({ priority }) => priority)).toEqual([
      10, 10, 0, -5,
    ]);
  });
});
