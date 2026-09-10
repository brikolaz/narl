import type { Entity } from "../../../../../core/model/Entity";
import { patchComponentByType } from "../../../../../core/model/queries/components/patch";
import type { Action } from "../../../../systems/actions/action";
import { isHostile } from "../../../../systems/attack/hostililty";
import { getEntityName } from "../../../../systems/inspect/getEntityName";
import { getRng } from "../../../../systems/rng/rng";
import {
  Hostility,
  HostilityComponent,
} from "../../../components/ai/HostilityComponent";
import type { Manual } from "../../../Manual";

export const RageBaitEntityManual: Manual = {
  onAfterTakeDamage(gameAction: Action, rageBait: Entity) {
    if (isHostile(rageBait) || !getRng(rageBait).chance(50)) {
      return;
    }
    patchComponentByType(rageBait, HostilityComponent, (hostility) => {
      hostility.hostility = Hostility.HOSTILE;
    });
    const name = getEntityName(rageBait);
    gameAction.info(`${name} is hostile`);
  },

  poke(gameAction: Action, rageBait: Entity) {
    const name = getEntityName(rageBait);

    if (isHostile(rageBait)) {
      gameAction.success(`Poked ${name}`);
      return;
    }

    gameAction.success(`Poked ${name}. It looks cute`);

    if (!getRng(rageBait).chance(20)) {
      return;
    }
    patchComponentByType(rageBait, HostilityComponent, (hostility) => {
      hostility.hostility = Hostility.HOSTILE;
    });
    gameAction.info(`${name} is hostile`);
  },
};
