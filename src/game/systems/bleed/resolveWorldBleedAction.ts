import { getComponentRegistryRecord } from "../../../core/model/registry/componentRegistry";
import { assert } from "../../../utils/assert";
import { BleedComponent } from "../../model/components/BleedComponent";
import { getHp } from "../../model/queries/hp";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { initDeath } from "../gameOver/death";
import { getEntityName } from "../inspect/getEntityName";
import type { WorldBleedAction } from "../world/types";

export const resolveWorldBleedAction = (
  gameAction: WorldBleedAction,
): ActionResolution => {
  const { bleedId } = gameAction;
  const action: Action = new Action(gameAction);

  (() => {
    const bleedRecord = assert(
      getComponentRegistryRecord(bleedId),
      "Bleed component not found",
    );
    assert(
      bleedRecord.component.type === BleedComponent.type,
      "Component is not bleed",
    );
    const bleed = bleedRecord.component as ReturnType<typeof BleedComponent>;
    const hp = getHp(bleedRecord.parent);

    initDeath(() => {
      hp.hp -= bleed.value;
    });

    return action.info(
      `${getEntityName(bleedRecord.parent)} bleed for ${bleed.value} HP`,
    );
  })();

  return action.resolve();
};
