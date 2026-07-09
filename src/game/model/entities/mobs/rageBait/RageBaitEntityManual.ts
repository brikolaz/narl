import type { Entity } from "../../../../../core/ecs/Entity";
import {
  replaceComponentByType
} from "../../../../../core/ecs/queries/components/patch";
import type { GameState } from "../../../../state/state";
import type { Action } from "../../../../systems/actions/action";
import { isHostile } from "../../../../systems/attack/hostililty";
import { getEntityName } from "../../../../systems/inspect/getEntityName";
import { RNG } from "../../../../systems/rng/rng";
import { HostileComponent } from "../../../components/mobs/HostileComponent";
import { PeacefulComponent } from "../../../components/mobs/PeacefulComponent";

export class RageBaitEntityManual {
  static onAfterTakeDamage(
    rageBait: Entity,
    _gameState: GameState,
    gameAction: Action,
  ) {
    if (isHostile(rageBait) || !RNG.mobs.chance(50)) {
      return;
    }
    replaceComponentByType(rageBait, PeacefulComponent, HostileComponent());
    const name = getEntityName(rageBait);
    gameAction.info(`${name} is hostile`);
  }

  static poke(rageBait: Entity, gameAction: Action) {
    const name = getEntityName(rageBait);

    if (isHostile(rageBait)) {
      gameAction.success(`You poked ${name}`);
      return;
    }

    gameAction.success(`You poked ${name}. It looks cute`);

    if (!RNG.mobs.chance(20)) {
      return;
    }
    replaceComponentByType(rageBait, PeacefulComponent, HostileComponent());
    gameAction.info(`${name} is hostile`);
  }
}
