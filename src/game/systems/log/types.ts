import type { DmgRange } from "../attack/dmg"
import type { MessageKey } from "../../i18n/types"
import type { GameAction } from "../actions/types"
import type { PlayerAction } from "../player/types"

export type BonusStatsLogProjection = {
  dmgMul?: number
  defMul?: number
}

export type EntityLogProjection = {
  name: string | LogMessage
  isPlayer: boolean
  description: string
  dmg?: DmgRange
  def?: number
  bonusStats?: BonusStatsLogProjection
  slotDmgMul?: number
  slotDefMul?: number
  container?: {
    size: number
    currentSize?: number
    depth: number
    contents?: {
      baseDmg: DmgRange
      dmg: DmgRange
      dmgMul: number
      def: number
      defMul?: number
      effectiveDef?: number
      defToDmgMul?: number
    }
  }
}

export type LogReplacement =
  | string
  | number
  | LogMessage
  | EntityLogProjection
  | readonly (string | LogMessage)[]

export type LogMessage = {
  key: MessageKey
  parameters?: Readonly<Record<string, string | number | LogMessage>>
  replacements?: readonly LogReplacement[]
}

export type LogEntry = {
  message: LogMessage
  action: Pick<GameAction, "type"> | GameAction
  startTurn: number
  endTurn: number
  count: number
}

export type PendingLog = {
  message: LogMessage
  action: GameAction
}

export type ActionLog = {
  turn: number
  action: PlayerAction
  timestamp: number
}
