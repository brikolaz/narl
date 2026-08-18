import { getComponentsByType } from "../../../core/model/queries/components/get";
import { removeComponents } from "../../../core/model/queries/components/remove";
import { getComponentRegistryRecord } from "../../../core/model/registry/componentRegistry";
import { BleedComponent } from "../../model/components/BleedComponent";
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
    const bleedRecord = getComponentRegistryRecord(bleedId);
    if (!bleedRecord) {
      return;
    }

    removeComponents(bleedId);
    const parent = bleedRecord.parent;

    if (getComponentsByType(parent, BleedComponent).length > 0) {
      action.info(`${getEntityName(parent)} bleed a bit less`);
    } else {
      action.info(`${getEntityName(bleedRecord.parent)} no longer bleed`);
    }
  })();

  return action.resolve();
};
