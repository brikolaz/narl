import { produce } from "immer";
import { getPlayerEntity } from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { curse } from "../curse/curse";
import { getEqSlotAt } from "../../model/queries/eq";
import { getContainerItemAt } from "../../model/queries/containers";
import { type PlayerInspectEqAction } from "../player/types";
import { getItemInspectText, increaseInspected } from "./inspect";

export const resolveInspectEqAction = (
  state: GameState,
  gameAction: PlayerInspectEqAction,
): ActionResolution => {
  const { eqSlot } = gameAction;
  const action = new Action(gameAction);

  const nextState = produce(state, (draft) => {
    const player = getPlayerEntity(draft);
    const slot = getEqSlotAt(player, eqSlot);
    const item = getContainerItemAt(slot, 1);

    if (!item) {
      return action.info(`EQ slot ${eqSlot} is empty`);
    }
    increaseInspected(item);

    action.info(getItemInspectText(item));
    curse(item, action);
  });

  return action.resolve(nextState, false);
};
