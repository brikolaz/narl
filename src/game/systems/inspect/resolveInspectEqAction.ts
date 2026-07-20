import { getPlayerEntity } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { curse } from "../curse/curse";
import { getEqSlot } from "../../model/queries/eq";
import { getContainerItemAt } from "../../model/queries/containers";
import { type PlayerInspectEqAction } from "../player/types";
import { getItemInspectText, increaseInspected } from "./inspect";

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
      return action.info(`EQ slot ${eqSlot} is empty`);
    }
    increaseInspected(item);

    action.info(getItemInspectText(item));
    curse(item, action);
  })();

  return action.resolve(false);
};
