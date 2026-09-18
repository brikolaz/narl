import { patchComponentByType } from "../../../core/model/queries/components/patch"
import { END_GAME_GATE_POSITION } from "../../../utils/constants"
import { PositionComponent } from "../../model/components/spatial/PositionComponent"
import { hasMobs } from "../mobs/mobs"
import { getPlayer } from "../player/player"
import { getPosition } from "../position/position"
import { discoverTiles, getTile } from "../world/tile"
import { STATE } from "../../state/state"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { addExplorationExp } from "../exp/exp"
import { PlayerActionTypeEnum, type PlayerMoveAction } from "../player/types"
import { WorldActionTypeEnum } from "../world/types"
import { markAsVisited } from "./exploration"
import { getNextPosition } from "./position"

const move = (nextPlayerPosition: number): void => {
  const player = getPlayer()
  patchComponentByType(
    player,
    PositionComponent,
    (component) => (component.position = nextPlayerPosition),
  )
  STATE.player = {
    player: addExplorationExp(getTile(nextPlayerPosition).floor, player),
    position: nextPlayerPosition,
  }
  markAsVisited(nextPlayerPosition)
}

export const resolvePlayerMoveAction = (
  gameAction: PlayerMoveAction,
): ActionResolution => {
  const { direction } = gameAction
  const action = new Action(gameAction)
  ;(() => {
    const currentPlayerPosition = getPosition(getPlayer())
    const nextPlayerPosition = getNextPosition({
      currentPosition: currentPlayerPosition,
      direction,
    })

    if (nextPlayerPosition === null) {
      return action.fail(`Cannot move ${direction.toLowerCase()}`)
    }

    const nextTile = getTile(nextPlayerPosition)
    if (hasMobs(nextTile)) {
      return action.addPendingImmediateAction({
        type: PlayerActionTypeEnum.PLAYER_ATTACK,
        direction,
      })
    }

    if (nextPlayerPosition === END_GAME_GATE_POSITION) {
      return action.addPendingImmediateAction({
        type: WorldActionTypeEnum.WORLD_WIN,
      })
    }

    discoverTiles(nextPlayerPosition)
    move(nextPlayerPosition)
    action.success()
  })()

  return action.resolve()
}
