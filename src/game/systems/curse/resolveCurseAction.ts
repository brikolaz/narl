import { produce } from "immer";
import { getPlayer } from "../../state";
import type { GameState } from "../../state/state";
import { Action, type ActionResolution } from "../turn";

import {
  addComponents,
  getEntityById,
  upsertComponent
} from "../../../core/ecs";
import { COLORS } from "../../../utils/colors";
import { ColorComponent } from "../../model/components/ColorComponent";
import { CursedComponent } from "../../model/components/CursedComponent";
import { getBackpack } from "../inv";
import { getItemName } from "../inv/items";
import { isCursed } from "./curse";

export const resolveCurseAction = (
  state: GameState,
  itemId: string,
): ActionResolution => {
  const action = new Action();
  const nextState = produce(state, (draft) => {
    const player = getPlayer(draft);
    const backpack = getBackpack(player);
    if (!backpack) {
      throw new Error("No player backpack");
    }
    const itemToCurse = getEntityById(backpack, itemId);
    if (!itemToCurse) {
      throw new Error("No item to curse");
    }
    if (isCursed(itemToCurse)) {
      return;
    }

    const logMsg = `${getItemName(itemToCurse)} got cursed`;
    addComponents(itemToCurse, new CursedComponent());
    upsertComponent(itemToCurse, new ColorComponent({ color: COLORS.CURSED }));
    return action.fulfill(logMsg);
  });

  return action.resolve(nextState, false);
};
