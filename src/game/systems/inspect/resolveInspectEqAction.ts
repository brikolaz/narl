import { getPlayer } from "../../model/queries/player";
import { assert } from "../../../utils/assert";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getContainerItemAt } from "../../model/queries/containers";
import {
  PlayerInspectActionReason,
  type PlayerInspectEqAction,
} from "../player/types";
import {
  getInspectDesc,
  getItemInspectText,
  increaseInspected,
} from "./inspect";
import { getEntityName } from "./getEntityName";
import { curse } from "../curse/curse";
import { getEqSlotByPosition } from "../../model/queries/eq";

export const resolveInspectEqAction = (
  gameAction: PlayerInspectEqAction,
): ActionResolution => {
  const { eqSlot, reason } = gameAction;
  const action = new Action(gameAction);

  (() => {
    const player = getPlayer();
    const slot = assert(getEqSlotByPosition(player, eqSlot), "No EQ slot");
    const item = getContainerItemAt(slot, 1);

    if (!item) {
      return action.info(
        getInspectDesc(slot) || `${getEntityName(slot)} slot is empty`,
      );
    }
    increaseInspected(item);

    if (reason === PlayerInspectActionReason.MANUAL) {
      action.info(getItemInspectText(item));
    } else {
      action.info(
        `${getEntityName(player)} are bored and start to inspect your EQ. ${getEntityName(player)} see ${getItemInspectText(item)}`,
      );
    }
    curse(action, item);
  })();

  return action.resolve(false);
};
