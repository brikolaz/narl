import { getPlayerEntity } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEqSlot } from "../../model/queries/eq";
import { getContainerItemAt } from "../../model/queries/containers";
import { type PlayerInspectEqAction } from "../player/types";
import {
  getInspectDesc,
  getItemInspectText,
  increaseInspected,
} from "./inspect";
import { getEntityName } from "./getEntityName";
import { curse } from "../curse/curse";

export const resolveInspectEqAction = (
  gameAction: PlayerInspectEqAction,
): ActionResolution => {
  const { eqSlot } = gameAction;
  const action = new Action(gameAction);

  (() => {
    const player = getPlayerEntity();
    const slot = getEqSlot(player, eqSlot);
    const item = getContainerItemAt(slot, 1);

    if (!item) {
      return action.info(getInspectDesc(slot) || `${getEntityName(slot)} slot is empty`);
    }
    increaseInspected(item);

    action.info(getItemInspectText(item));
    curse(action, item);
  })();

  return action.resolve(false);
};
