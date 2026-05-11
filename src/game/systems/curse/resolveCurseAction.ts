import { produce } from "immer";
import { getPlayer } from "../../state";
import type { GameState } from "../../state/state";
import { type ActionResolution } from "../turn";

import {
  addComponents,
  getComponentByType,
  getEntityById,
  hasComponentByType,
  upsertComponent,
} from "../../../core/ecs";
import { COLORS } from "../../../utils/colors";
import { NameComponent } from "../../model/components/AppearanceComponent copy";
import { ColorComponent } from "../../model/components/ColorComponent";
import { CursedComponent } from "../../model/components/CursedComponent";
import { getBackpack } from "../inv";
import { Action } from "../log";
import { isCursed } from "./cursed";

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

    addComponents(itemToCurse, new CursedComponent());
    upsertComponent(itemToCurse, new ColorComponent({ color: COLORS.CURSED }));

    const itemName = getComponentByType(itemToCurse, NameComponent)?.name;

    return action.fulfill(`${itemName} got cursed`);
  });

  return action.resolve(nextState, false);
};
