import { beforeEach, describe, expect, it } from "vitest";
import { initState, STATE } from "../../../state/state";
import { Action } from "../action";
import { InternalActionType } from "../../internal/type";
import { applyTimedAction } from "./timedActions";

describe("applyTimedAction", () => {
  beforeEach(() => {
    initState();
  });

  const getImmediateAction = (duration: number) => {
    const action = new Action({
      type: InternalActionType.LOG,
      message: "source",
    });
    action.addPendingImmediateAction(
      { type: InternalActionType.LOG, message: "tick" },
      duration,
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
});
