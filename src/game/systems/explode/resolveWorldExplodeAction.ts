import type { Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { getEntityById } from "../../../core/model/queries/entities/get";
import { ExplodeComponent } from "../../model/components/ExplodeComponent";
import { ExplodeRangeComponent } from "../../model/components/ExplodeRangeComponent";
import { HpComponent } from "../../model/components/mobs/HpComponent";
import { getPosition } from "../../model/queries/position";
import { STATE } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import {
  WorldActionType,
  WorldDealDamageActionReason,
  type WorldExplodeAction,
} from "../world/types";
import { rollExplodeDmg } from "./dmg";

// TODO: handle items with hp
const getVulnerableTargets = (source: Entity, position: number): Entity[] => {
  const tile = STATE.world[position];
  if (!tile) {
    return [];
  }

  const player = STATE.player.player;
  const entities = [
    ...tile.mobs.filter(mob => mob.id !== source.id),
    ...(player && getPosition(player) === position ? [player] : []),
  ];

  return entities.filter((entity) => hasComponentsByType(entity, HpComponent));
};

export const resolveWorldExplodeAction = (
  gameAction: WorldExplodeAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    const source = getEntityById(gameAction.entityId);
    if (!source) {
      return;
    }
    const explode = getComponentByType(source, ExplodeComponent);
    const explodeRange = getComponentByType(source, ExplodeRangeComponent);
    if (!explode || !explodeRange) {
      return;
    }

    const position = getPosition(source);
    action.success(`${getEntityName(source)} explodes`)

    for (
      let targetPosition = position - explodeRange.range;
      targetPosition <= position + explodeRange.range;
      targetPosition += 1
    ) {
      for (const target of getVulnerableTargets(source, targetPosition)) {
        action.addPendingImmediateAction({
          type: WorldActionType.DEAL_DAMAGE,
          sourceId: source.id,
          targetId: target.id,
          dmg: rollExplodeDmg(source),
          reason: WorldDealDamageActionReason.EXPLODE,
        });
      }
    }

    action.addPendingImmediateAction(
      {
        type: WorldActionType.CLEANUP_EXPLODE,
        entityId: source.id,
      },
      1,
      1,
    );
  })();

  return action.resolve();
};
