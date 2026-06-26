import {
  patchComponentByType,
} from "../../../../../core/ecs/queries/component";
import type { GameState } from "../../../../state/state";
import type { Action } from "../../../../systems/actions/action";
import { RNG } from "../../../../systems/rng/rng";
import { HostileComponent } from "../../../components/mobs/HostileComponent";
import { PeacefulComponent } from "../../../components/mobs/PeacefulComponent";
import { getEntityName } from "../../../../systems/inspect/getEntityName";
import type { RageBaitEntity } from "./RageBaitEntity";

export class RageBaitEntityManual {
  static onAfterTakeDamage(
    rageBait: RageBaitEntity,
    _gameState: GameState,
    gameAction: Action,
  ) {
    if (!RNG.mobs.chance(50)) {
      return;
    }
    patchComponentByType(
      rageBait,
      PeacefulComponent,
      () => new HostileComponent(),
    );
    const name = getEntityName(rageBait);
    gameAction.info(`${name} is hostile`);
  }
}
