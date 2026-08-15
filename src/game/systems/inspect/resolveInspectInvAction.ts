import { assert } from "../../../utils/assert";
import {
  getBackpack,
  getContainerItemAt,
} from "../../model/queries/containers";
import { getPlayer } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { curse } from "../curse/curse";
import { type PlayerInspectInvAction } from "../player/types";
import { getItemInspectText, increaseInspected } from "./inspect";

export const resolveInspectInvAction = (
  gameAction: PlayerInspectInvAction,
): ActionResolution => {
  const { invSlot } = gameAction;
  const action: Action = new Action(gameAction);

  (() => {
    const player = getPlayer();
    const backpack = assert(getBackpack(player), "Player has no backpack");

    const item = getContainerItemAt(backpack, invSlot);

    if (!item) {
      return action.info(`INV slot ${invSlot} is empty`);
    }
    increaseInspected(item);

    action.info(getItemInspectText(item));
    curse(action, item);
  })();

  return action.resolve(false);
};
