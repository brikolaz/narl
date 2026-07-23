import { getEntityById } from "../../../../core/ecs/queries/entities/get";
import { getManual } from "../../../model/entities/getManual";
import { Action } from "../../actions/action";
import type { ActionResolution, GameAction } from "../../actions/types";
import type { DisableSlotEffect } from "../types";

export const applyDisableSlotEffect = (
  gameAction: GameAction,
  effect: DisableSlotEffect,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    const entity = action.assert(
      getEntityById(effect.entityId),
      "No slot to disable",
    );
    const manual = getManual(entity);
    manual?.disable?.(entity, action);
  })();

  return action.resolve();
};
