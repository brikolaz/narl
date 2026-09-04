import { removeComponents } from "../../../core/model/queries/components/remove";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { WorldCleanupBlockAction } from "../world/types";

export const resolveWorldCleanupBlockAction = (
  gameAction: WorldCleanupBlockAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    removeComponents(gameAction.defId);
  })();

  return action.resolve();
};
