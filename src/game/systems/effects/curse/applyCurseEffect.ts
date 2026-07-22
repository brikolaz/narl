import { upsertComponents } from "../../../../core/ecs/queries/components/add";
import { getEntityById } from "../../../../core/ecs/queries/entities/get";
import { COLORS } from "../../../../utils/colors";
import { ColorComponent } from "../../../model/components/display/ColorComponent";
import { CursedComponent } from "../../../model/components/items/CursedComponent";
import { getManual } from "../../../model/entities/getManual";
import { Action } from "../../actions/action";
import type { ActionResolution, GameAction } from "../../actions/types";
import { getEntityName } from "../../inspect/getEntityName";
import type { CurseEffect } from "../effects";

export const applyCurseEffect = (
  gameAction: GameAction,
  effect: CurseEffect,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    const entity = action.assert(
      getEntityById(effect.entityId),
      "No entity to curse",
    );
    const name = getEntityName(entity);
    const manual = getManual(entity);
    if (!manual) {
      return;
    }
    manual?.curse?.(entity);
    const curseComponents = [
      CursedComponent(),
      ColorComponent({ color: COLORS.CURSED }),
    ];
    upsertComponents(entity, ...curseComponents);
    action.success(`${name} got cursed`);
  })();

  return action.resolve();
};
