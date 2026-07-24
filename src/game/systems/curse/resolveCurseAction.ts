import { upsertComponents } from "../../../core/ecs/queries/components/add";
import { getEntityById } from "../../../core/ecs/queries/entities/get";
import { COLORS } from "../../../utils/colors";
import { ColorComponent } from "../../model/components/display/ColorComponent";
import { CursedComponent } from "../../model/components/items/CursedComponent";
import { getManual } from "../../model/entities/getManual";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import type { WorldCurseAction } from "../world/types";

export const resolveCurseAction = (
  gameAction: WorldCurseAction,
): ActionResolution => {
  const { entityId } = gameAction;
  const action = new Action(gameAction);

  (() => {
    const entity = action.assert(
      getEntityById(entityId),
      "No entity to curse",
    );
    const name = getEntityName(entity);
    const manual = getManual(entity);
    if (!manual) {
      return;
    }
    manual?.curse?.(action, entity);
    const curseComponents = [
      CursedComponent(),
      ColorComponent({ color: COLORS.CURSED }),
    ];
    upsertComponents(entity, ...curseComponents);
    action.info(`${name} got cursed`);
  })();

  return action.resolve();
};
