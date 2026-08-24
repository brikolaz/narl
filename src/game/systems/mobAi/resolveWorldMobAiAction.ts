import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { Action } from "../actions/action";
import type { ActionResolution, GameAction } from "../actions/types";
import { type WorldMobAiAction } from "../world/types";
import { attack } from "./commands/attack";
import { move } from "./commands/move";

export const resolveWorldMobAiAction = (
  gameAction: WorldMobAiAction,
): ActionResolution => {
  const { mobId } = gameAction;
  const action = new Action(gameAction);

  (() => {
    const mob = assert(getEntityById(mobId), "No mob");
    const pendingActions: (GameAction | undefined)[] = [
      attack(mob),
      move(mob),
    ];
    pendingActions
      .filter((pendingAction) => pendingAction !== undefined)
      .forEach((pendingAction) => {
        action.addPendingImmediateAction(pendingAction);
      });
  })();

  return action.resolve();
};
