import { getPlayer } from "../../model/queries/player";
import { assert } from "../../../utils/assert";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import {
  getBackpack,
  getContainerItemAt,
} from "../../model/queries/containers";
import {
  PlayerInspectActionReason,
  type PlayerInspectInvAction,
} from "../player/types";
import { getItemInspectText, increaseInspected } from "./inspect";
import { curse } from "../curse/curse";
import { getEntityName } from "./getEntityName";

export const resolveInspectInvAction = (
  gameAction: PlayerInspectInvAction,
): ActionResolution => {
  const { invSlot, reason } = gameAction;
  const action: Action = new Action(gameAction);

  (() => {
    const player = getPlayer();
    const backpack = assert(getBackpack(player), "Player has no backpack");

    const item = getContainerItemAt(backpack, invSlot);

    if (!item) {
      return action.info(`INV slot ${invSlot} is empty`);
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
