import { produce } from "immer";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { WorldCurseItemAction } from "../actions/gameAction/types";
import type { ActionResolution } from "../actions/types";
import { getPlayer } from "../../state/selectors/player";
import { getBackpack, isContainer } from "../inv/containers";
import { getEntityById } from "../../../core/ecs/queries/entities";
import { isCursed } from "./curse";
import { getItemName } from "../inv/items";
import { CursedComponent } from "../../model/components/CursedComponent";
import {
  addComponents,
  upsertComponent,
} from "../../../core/ecs/queries/component";
import { ColorComponent } from "../../model/components/ColorComponent";
import { COLORS } from "../../../utils/colors";
import type { Entity } from "../../../core/ecs/Entity";
import { DmgModComponent } from "../../model/components/DmgModComponent";

const curseItem = (item: Entity) => {
  const components = [new CursedComponent()];
  upsertComponent(item, new ColorComponent({ color: COLORS.CURSED }));
  if (isContainer(item)) {
    components.push(new DmgModComponent({ dmgMod: 0.5 }));
  }
  addComponents(item, ...components);
};

export const resolveCurseItemAction = (
  state: GameState,
  { itemId }: WorldCurseItemAction,
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
    curseItem(itemToCurse);
    return action.success(logMsg);
  });

  return action.resolve(nextState);
};
