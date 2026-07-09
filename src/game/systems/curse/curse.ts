import type { Entity } from "../../../core/ecs/Entity";
import { upsertComponents } from "../../../core/ecs/queries/components/add";
import { COLORS } from "../../../utils/colors";
import { ColorComponent } from "../../model/components/display/ColorComponent";
import { CursedComponent } from "../../model/components/items/CursedComponent";
import { getManual } from "../../model/entities/getManual";
import { isCursed } from "../../model/queries/curse";
import type { GameState } from "../../state/state";
import type { Action } from "../actions/action";
import { getEntityName } from "../inspect/getEntityName";

export const curse = (item: Entity, gameState: GameState, action: Action) => {
  const manual = getManual(item);

  if (!isCursed(item) && manual?.shouldBeCursed?.(item, gameState)) {
    const itemName = getEntityName(item);
    manual?.curse?.(item, gameState);
    const curseComponents = [
      CursedComponent(),
      ColorComponent({ color: COLORS.CURSED }),
    ];
    upsertComponents(item, ...curseComponents);
    action.info(`${itemName} got cursed`);
  }
};
