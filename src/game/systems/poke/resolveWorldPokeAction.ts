import { getEntityLogProjection } from "../log/getEntityLogProjection"
import { getEntityName } from "../inspect/getEntityName"
import { getComponentByType } from "../../../core/model/queries/components/get"
import { ProvokableComponent } from "../../model/components/ai/ProvokableComponent"
import { isHostile } from "../attack/hostility"
import { getRng } from "../rng/rng"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getMob } from "../mobs/mobs"
import { getNextPosition, getPosition } from "../position/position"
import { getPlayer } from "../player/player"
import { WorldActionTypeEnum, type WorldPokeAction } from "../world/types"
import { getTile } from "../world/tile"
import { increaseInspected } from "../inspect/inspect"

export const resolveWorldPokeAction = (
  gameAction: WorldPokeAction,
): ActionResolution => {
  const action = new Action(gameAction)
  const { sourceId, direction } = gameAction

  ;(() => {
    const source = getEntityById(sourceId)
    if (!source) {
      return action.fail("POKE.NO_TARGET")
    }

    const targetPosition = getNextPosition({
      currentPosition: getPosition(source),
      direction,
    })
    if (targetPosition === null) {
      return action.fail("POKE.NO_TARGET")
    }

    const player = getPlayer()
    const target =
      source.id !== player.id && getPosition(player) === targetPosition
        ? player
        : getMob(getTile(targetPosition))
    if (!target) {
      return action.fail("POKE.NO_TARGET")
    }

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
  })()

  return action.resolve()
}
