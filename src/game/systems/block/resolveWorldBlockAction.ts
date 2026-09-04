import { upsertComponents } from "../../../core/model/queries/components/add";
import { getEntityById } from "../../../core/model/queries/entities/get";
import { assert } from "../../../utils/assert";
import { DefComponent } from "../../model/components/items/DefComponent";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { WorldActionType, type WorldBlockAction } from "../world/types";
import { getBlockDef } from "./getBlockDef";

export const resolveWorldBlockAction = (
  gameAction: WorldBlockAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    const entity = assert(
      getEntityById(gameAction.entityId),
      "No entity to block",
    );
    const blockDef = DefComponent({ def: getBlockDef(entity) });

    upsertComponents(entity, blockDef);
action.success("You block.");
    action.addPendingDelayedAction({
      type: WorldActionType.CLEANUP_BLOCK,
      defId: blockDef.id,
    });
  })();

  return action.resolve();
};
