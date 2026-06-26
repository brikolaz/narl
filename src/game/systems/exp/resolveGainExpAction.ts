import { produce } from "immer";
import { getPlayerEntity } from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { WorldGainExpAction } from "../world/types";
import { addExp } from "./exp";

// TODO: add targetEntityId
export const resolveGainExpAction = (
  state: GameState,
  gameAction: WorldGainExpAction,
): ActionResolution => {
  const action = new Action(gameAction);
  const { exp } = gameAction;

  const nextState = produce(state, (draft) => {
    const target = getPlayerEntity(draft);

    addExp(target, exp);
    action.info(`Gained ${exp} EXP`);
  });

  return action.resolve(nextState);
};
