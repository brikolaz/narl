import { isComponentType } from "../../../core/model/queries/components/has";
import { getComponentRegistryRecord } from "../../../core/model/registry/componentRegistry";
import { assert } from "../../../utils/assert";
import { BleedComponent } from "../../model/components/BleedComponent";
import { getHp } from "../../model/queries/hp";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { initDeath } from "../gameOver/death";
import { getEntityName } from "../inspect/getEntityName";
import { getRng } from "../rng/rng";
import type { WorldBleedAction } from "../world/types";

export const resolveWorldBleedAction = (
  gameAction: WorldBleedAction,
): ActionResolution => {
  const { bleedId } = gameAction;
  const action: Action = new Action(gameAction);

  (() => {
    const { component: bleed, parent } = assert(
      getComponentRegistryRecord(bleedId),
      "No bleed component",
    );
    assert(isComponentType(bleed, BleedComponent), "No bleed component");
    const hp = getHp(parent);
    const dmg = getRng(parent).range(bleed.min, bleed.max);

    initDeath(() => {
      hp.hp -= dmg;
    });

    return action.info(`${getEntityName(parent)} bleed for ${dmg} HP`);
  })();

  return action.resolve();
};
