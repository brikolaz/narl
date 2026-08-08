import { getComponentRegistryRecord } from "../../../core/model/registry/componentRegistry";
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
    const bleedRecord = action.assert(
      getComponentRegistryRecord(bleedId),
      "Bleed component not found",
    );
    action.assertCondition(
      bleedRecord.component.type === BleedComponent.type,
      "Component is not bleed",
    );

    action.info(`${getEntityName(bleedRecord.parent)} bleed`);

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
