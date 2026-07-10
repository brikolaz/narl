import { getPlayerEntity } from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { curse } from "../curse/curse";
import { getBackpack, getContainerItemAt } from "../../model/queries/containers";
import { type PlayerInspectInvAction } from "../player/types";
import { getItemInspectText, increaseInspected } from "./inspect";

export const resolveInspectInvAction = (
  state: GameState,
  gameAction: PlayerInspectInvAction,
): ActionResolution => {
  const { invSlot } = gameAction;
  const action: Action = new Action(gameAction);

  (() => {
    const player = getPlayerEntity(state);
    const backpack = action.assert(
      getBackpack(player),
      "Player has no backpack",
    );

    const item = getContainerItemAt(backpack, invSlot);

    if (!item) {
      return action.info(`INV slot ${invSlot} is empty`);
    }
    increaseInspected(item);

    action.info(getItemInspectText(item));
    curse(item, state, action);
  })();

  return action.resolve(state, false);
};
