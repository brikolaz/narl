import { getComponentsByType } from "../../../core/model/queries/components/get";
import { getComponentRegistryRecord } from "../../../core/model/registry/componentRegistry";
import { assert } from "../../../utils/assert";
import { BleedComponent } from "../../model/components/BleedComponent";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import { WorldActionType, type WorldInitBleedAction } from "../world/types";

export const resolveWorldInitBleedAction = (
  gameAction: WorldInitBleedAction,
): ActionResolution => {
  const { bleedId } = gameAction;
  const action: Action = new Action(gameAction);

  (() => {
    const bleedRecord = assert(
      getComponentRegistryRecord(bleedId),
      "Bleed component not found",
    );
    assert(
      bleedRecord.component.type === BleedComponent.type,
      "Component is not bleed",
    );

    const parent = bleedRecord.parent;
    const multiple =
      getComponentsByType(parent, BleedComponent).length > 1;
    if (multiple) {
      action.info(`${getEntityName(parent)} bleed some more`);
    } else {
      action.info(`${getEntityName(parent)} bleed`);
    }

    action.addPendingDelayedAction(
      {
        type: WorldActionType.BLEED,
        bleedId,
      },
      1,
      3,
    );
    action.addPendingDelayedAction(
      {
        type: WorldActionType.CLEANUP_BLEED,
        bleedId,
      },
      3,
    );
  })();

  return action.resolve();
};
