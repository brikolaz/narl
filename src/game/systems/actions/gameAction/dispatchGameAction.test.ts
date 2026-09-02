import { beforeEach, describe, expect, it } from "vitest";
import { createGame, type Game } from "../../../../game";
import { InternalActionType } from "../../internal/type";
import { Action } from "../action";
import { drainResolution, type DrainContext } from "./dispatchGameAction";

describe("drainResolution", () => {
  let game: Game
  beforeEach(() => {
    game = createGame()
    game.dispatch({ type: InternalActionType.INIT })
  });

  it("drains pending actions from highest to lowest priority", () => {
    const action = new Action({
      type: InternalActionType.LOG,
      message: "source",
    });
    const pendingActions = [
      { message: "low", priority: -5 },
      { message: "high first", priority: 10 },
      { message: "default", priority: 0 },
      { message: "high second", priority: 10 },
    ];

    for (const { message, priority } of pendingActions) {
      action.addPendingImmediateAction(
        { type: InternalActionType.LOG, message },
        1,
        priority,
      );
    }

    const context: DrainContext = {
      pendingLogs: [],
      processedActions: new Set(),
    };

    drainResolution(action.resolve(), context);

    expect(context.pendingLogs.map(({ message }) => message)).toEqual([
      "high first",
      "high second",
      "default",
      "low",
    ]);
  });

  it("keeps priorities local to the current branch", () => {

    const action = new Action({
      type: InternalActionType.LOG,
      message: "parent",
    });
    action.addPendingImmediateAction(
      { type: InternalActionType.LOG, message: "sibling1" },
      1,
      10,
    );
    action.addPendingImmediateAction(
      { type: InternalActionType.LOG, message: "sibling2" },
      1,
      5,
    );
    const context: DrainContext = {
      pendingLogs: [],
      processedActions: new Set(),
    };

    drainResolution(action.resolve(), context);

    expect(context.pendingLogs.map(({ message }) => message)).toEqual([
      "sibling1",
      "sibling2"
    ]);
  });
});
