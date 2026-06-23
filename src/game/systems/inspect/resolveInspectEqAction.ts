import { produce } from "immer";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { PlayerInspectEqAction } from "../player/types";
import { getPlayerEntity } from "../../state/selectors/player";
import { getEqSlotAt } from "../eq/eq";
import { getContainerItemAt } from "../inv/containers";
import { getItemInspectText } from "./inspect";

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

    action.info(getItemInspectText(item));
  });

  return action.resolve(nextState, false);
};
