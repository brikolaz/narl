import type { Entity } from "../../../../core/model/Entity"
import { upsertComponents } from "../../../../core/model/queries/components/add"
import { getComponentByType } from "../../../../core/model/queries/components/get"
import { hasComponentsByType } from "../../../../core/model/queries/components/has"
import { FemaleComponent } from "../../../model/components/gender/FemaleComponent"
import { WokeCurseComponent } from "../../../model/components/curse/WokeCurseComponent"
import { WokedComponent } from "../../../model/components/state/WokedComponent"
import type { Action } from "../../actions/action"
import { isPlayer } from "../../player/player"
import { getRng } from "../../rng/rng"
import { curse } from "../curse"

export const applyWokeCurse = (
  action: Action,
  source: Entity,
  target: Entity,
) => {
  if (
    !isPlayer(source) ||
    hasComponentsByType(source, WokedComponent) ||
    !hasComponentsByType(target, FemaleComponent)
  ) {
    return
  }

  const wokeCurse = getComponentByType(target, WokeCurseComponent)
  if (!wokeCurse || !getRng(target).chance(wokeCurse.chance)) {
    return
  }

  upsertComponents(source, WokedComponent())
  curse(action, source)
}
