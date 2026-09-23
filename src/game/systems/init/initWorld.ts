import { upsertComponents } from "../../../core/model/queries/components/add"
import { END_GAME_GATE_POSITION, MAP_SIZE } from "../../../utils/constants"
import { getDummyArray } from "../../../utils/getDummyArray"
import { VisitedComponent } from "../../model/components/state/VisitedComponent"
import { HelmetEntityFactory } from "../../model/entities/items/helmet/factory"
import { HornedHelmetEntity } from "../../model/entities/items/helmet/variants/HornedHelmet/HornedHelmetEntity"
import { RingEntityFactory } from "../../model/entities/items/ring/factory"
import { SwordEntityFactory } from "../../model/entities/items/sword/factory"
import { RageBaitEntityFactory } from "../../model/entities/mobs/rageBait/factory"
import { WallEntityFactory } from "../../model/entities/wall/factory"
import type { WorldState } from "../../state/state"
import { setPosition } from "../position/position"
import { getDefaultTile } from "../world/tile"

export const initWorld = (): WorldState => {
  const world: WorldState = getDummyArray(MAP_SIZE).map((_, position) =>
    getDefaultTile(position),
  )

  const ring = RingEntityFactory.getDefault()
  world[2].items.push(ring)
  setPosition(ring, 2)

  const sword = SwordEntityFactory.getDefault()
  world[3].items.push(sword)
  setPosition(sword, 3)

  const hornedHelmet = HelmetEntityFactory.getVariant(HornedHelmetEntity.type)
  world[4].items.push(hornedHelmet)
  setPosition(hornedHelmet, 4)

  world[5].mobs.push(RageBaitEntityFactory.getDefault())
  setPosition(world[5].mobs[0], 5)
  world[6].mobs.push(RageBaitEntityFactory.getDefault())
  setPosition(world[6].mobs[0], 6)

  world[7].mobs.push(RageBaitEntityFactory.getDefault())
  setPosition(world[7].mobs[0], 7)

  upsertComponents(world[0].floor, VisitedComponent())

  world[END_GAME_GATE_POSITION] = getDefaultTile(END_GAME_GATE_POSITION)
  world[END_GAME_GATE_POSITION].items.push(WallEntityFactory.getDefault())
  setPosition(world[END_GAME_GATE_POSITION].items[0], END_GAME_GATE_POSITION)

  return world
}
