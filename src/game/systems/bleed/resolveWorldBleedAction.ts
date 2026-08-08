import { getComponentRegistryRecord } from "../../../core/model/registry/componentRegistry";
import { BleedComponent } from "../../model/components/BleedComponent";
import { getHp } from "../../model/queries/hp";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import type { WorldBleedAction } from "../world/types";

export const resolveWorldBleedAction = (
  gameAction: WorldBleedAction,
): ActionResolution => {
  const { bleedId } = gameAction;
  const action: Action = new Action(gameAction);

  (() => {
    const bleedRecord = action.assert(
      getComponentRegistryRecord(bleedId),
      "Bleed component not found",
    );
    action.assertCondition(
      bleedRecord.component.type === BleedComponent.type,
      "Component is not bleed",
    );
    const bleed = bleedRecord.component as ReturnType<typeof BleedComponent>;
    const hp = getHp(bleedRecord.parent);

    hp.hp -= bleed.value;

    return action.info(
      `${getEntityName(bleedRecord.parent)} bleed for ${bleed.value} HP`,
    );
  })();

  return action.resolve();
};
