import { PlayerEntityFactory } from "../../model/entities/player/factory"
import { getPosition } from "../position/position"
import type { PlayerState } from "../../state/state"

export const initPlayer = (): PlayerState => {
  const player = PlayerEntityFactory.getDefault()
  return {
    player,
    position: getPosition(player),
  }
}
