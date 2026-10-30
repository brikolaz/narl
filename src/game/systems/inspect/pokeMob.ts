import type { Entity } from "../../../core/model/Entity"
import type { Action } from "../actions/action"
import { getEntityLogProjection } from "../log/getEntityLogProjection"
import { getEntityName } from "./getEntityName"
import { getComponentByType } from "../../../core/model/queries/components/get"
import { ProvokableComponent } from "../../model/components/ai/ProvokableComponent"
import { isHostile } from "../attack/hostility"
import { getRng } from "../rng/rng"
import { WorldActionTypeEnum } from "../world/types"
import { increaseInspected } from "./inspect"

export const pokeMob = (
  action: Action,
  source: Entity,
  target: Entity,
): void => {
  action.success(
    "POKE.RESULT",
    getEntityName(source),
    getEntityLogProjection(target),
  )
  increaseInspected(target)
  const provokable = getComponentByType(target, ProvokableComponent)
  if (
    provokable &&
    !isHostile(target) &&
    getRng(target).chance(provokable.pokeChance)
  ) {
    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_ENRAGE,
      entityId: target.id,
      sourceId: source.id,
    })
  }
}
