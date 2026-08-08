import { removeComponents } from "../../../core/model/queries/components/remove";
import { getComponentRegistryRecord } from "../../../core/model/registry/componentRegistry";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import type { WorldCleanupBleedAction } from "../world/types";

export const resolveWorldCleanupBleedAction = (
  gameAction: WorldCleanupBleedAction,
): ActionResolution => {
  const { bleedId } = gameAction;
  const action = new Action(gameAction);

  (() => {
    const bleedRecord = action.assert(
      getComponentRegistryRecord(bleedId),
      "Bleed component not found",
    );

    removeComponents(bleedId);
    action.info(`${getEntityName(bleedRecord.parent)} no longer bleed`);
  })();

  return action.resolve();
};
