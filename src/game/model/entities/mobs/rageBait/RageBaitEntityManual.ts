import type { Entity } from "../../../../../core/model/Entity";
import { replaceComponentsByType } from "../../../../../core/model/queries/components/patch";
import type { Action } from "../../../../systems/actions/action";
import { isHostile } from "../../../../systems/attack/hostililty";
import { getEntityName } from "../../../../systems/inspect/getEntityName";
import { RNG } from "../../../../systems/rng/rng";
import { HostileComponent } from "../../../components/mobs/HostileComponent";
import { PeacefulComponent } from "../../../components/mobs/PeacefulComponent";
import type { Manual } from "../../../Manual";

export const RageBaitEntityManual: Manual = {
  onAfterTakeDamage(gameAction: Action, rageBait: Entity) {
    if (isHostile(rageBait) || !RNG.mobs.chance(50)) {
      return;
    }
    replaceComponentsByType(rageBait, PeacefulComponent, HostileComponent());
    const name = getEntityName(rageBait);
    gameAction.info(`${name} is hostile`);
  },

  poke(gameAction: Action, rageBait: Entity) {
    const name = getEntityName(rageBait);

    if (isHostile(rageBait)) {
      gameAction.success(`You poked ${name}`);
      return;
    }

    gameAction.success(`You poked ${name}. It looks cute`);

    if (!RNG.mobs.chance(20)) {
      return;
    }
    replaceComponentsByType(rageBait, PeacefulComponent, HostileComponent());
    gameAction.info(`${name} is hostile`);
  },
};
