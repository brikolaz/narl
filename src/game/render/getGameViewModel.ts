import { getComponentByType } from "../../core/model/queries/components/get"
import { ColorComponent } from "../model/components/display/ColorComponent"
import { GlyphComponent } from "../model/components/display/GlyphComponent"
import { PositionComponent } from "../model/components/spatial/PositionComponent"
import {
  getBackpack,
  getContainerItemAt,
} from "../systems/containers/containers"
import { getEq } from "../systems/eq/eq"
import { getPosition } from "../systems/position/position"
import { getPlayer } from "../systems/player/player"
import { STATE, type DeathContext } from "../state"
import { ALL_CONTAINER_SLOTS } from "../systems/containers/types"
import { isGameOver } from "../systems/gameOver/gameOver"
import type { LogEntry } from "../systems/log/types"
import { getEqStats } from "./eqStats"
import { getPlayerStats } from "../systems/stats/playerStats"
import { isWin } from "../systems/win/resolveWorldWinAction"
import { getRenderedMap } from "./getRenderedMap"
import type { Highlight } from "./state/highlight"
import { UI_STATE } from "./state/state"

export type ColoredGlyphView = {
  char: string
  color?: string
  background?: string
}

type RenderedMap = Array<ColoredGlyphView & { position: number }>
export type PlayerStatsView = Record<string, string | number>
export type EquipmentView = ColoredGlyphView[]
export type BackpackView = ColoredGlyphView[]

export type GameViewModel = {
  gameOver: typeof isGameOver
  win: typeof isWin
  turn: number
  map: RenderedMap
  playerStats: PlayerStatsView
  equipment: EquipmentView
  backpack: BackpackView
  logs: LogEntry[]
  death: DeathContext
}

const getGlyphView = (
  entity: Parameters<typeof getComponentByType>[0],
): ColoredGlyphView => {
  return {
    char:
      getComponentByType(entity, GlyphComponent)?.glyph ??
      GlyphComponent.defaults.glyph,
    color: getComponentByType(entity, ColorComponent)?.color,
  }
}

const getHighlightedGlyphView = <Slot extends number>(
  entity: Parameters<typeof getComponentByType>[0],
  position: number,
  highlight: Highlight<Slot>,
): ColoredGlyphView => {
  const glyph = getGlyphView(entity)

  return {
    ...glyph,
    background:
      position === highlight.getHighlightedSlot()
        ? highlight.getBackground()
        : undefined,
  }
}

const getPlayerStatsView = (): PlayerStatsView => {
  const player = getPlayer()

  return {
    ...getPlayerStats(player),
    ...getEqStats(player),
  }
}

const getEquipmentView = (): EquipmentView => {
  const player = getPlayer()
  const slots = getEq(player)

  return slots.map((slot) =>
    getHighlightedGlyphView(
      getContainerItemAt(slot, 1),
      getComponentByType(slot, PositionComponent)?.position ?? -1,
      UI_STATE.highlights.eqSlot,
    ),
  )
}

const getBackpackView = (): BackpackView => {
  const backpack = getBackpack(getPlayer())

  return [...ALL_CONTAINER_SLOTS].map((slot) =>
    getHighlightedGlyphView(
      backpack ? getContainerItemAt(backpack, slot) : undefined,
      slot,
      UI_STATE.highlights.invSlot,
    ),
  )
}

export const getGameViewModel = (): GameViewModel => ({
  gameOver: isGameOver,
  win: isWin,
  turn: STATE.turn,
  map: getRenderedMap().map((tile) => ({
    char: tile.char ?? " ",
    color: tile.color,
    position: tile.position,
    background:
      tile.position - 1 - getPosition(getPlayer()) ===
      UI_STATE.highlights.map.getHighlightedSlot()
        ? UI_STATE.highlights.map.getBackground()
        : undefined,
  })),
  playerStats: getPlayerStatsView(),
  equipment: getEquipmentView(),
  backpack: getBackpackView(),
  logs: STATE.log,
  death: STATE.death,
})
