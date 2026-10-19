import type { DmgRange } from "../attack/dmg"
import type { MessageKey } from "../../i18n/types"
import type { GameAction } from "../actions/types"
import type { PlayerAction } from "../player/types"

export type EntityLogProjection = {
  name: string
  isPlayer: boolean
  description: string
  dmg?: DmgRange
  def?: number
  bonusDmgMul?: number
  container?: {
    size: number
    depth: number
    contents?: {
      baseDmg: DmgRange
      dmg: DmgRange
      dmgMul: number
      def: number
      defToDmgMul?: number
    }
  }
}

export type LogReplacement =
  string | number | EntityLogProjection | readonly string[]

export type LogMessage = {
  key: MessageKey
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
