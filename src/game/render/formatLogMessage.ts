import { LOCALE } from "../../utils/constants"
import { formatMessage } from "../i18n/messages"
import type { LogEntry, LogMessage, LogReplacement } from "../systems/log/types"
import { formatItemInspection } from "./formatItemInspection"

const formatReplacement = (
  value: LogReplacement,
  locale: string,
  inspect: boolean,
): string | readonly string[] => {
  if (typeof value !== "object") return String(value)
  if (!("name" in value)) return value
  if (inspect) return formatItemInspection(value, locale)
  return value.isPlayer
    ? formatMessage("ENTITY.PLAYER", {}, locale)
    : value.name
}

export const formatLogMessage = (
  message: LogMessage,
  locale: string = LOCALE,
): string => {
  const parameters: Record<string, unknown> = {}
  const replacements = message.replacements ?? []
  replacements.forEach((value, index) => {
    parameters[`arg${index}`] = formatReplacement(
      value,
      locale,
      message.key === "INSPECT.ITEM",
    )
    if (typeof value === "object" && "description" in value) {
      parameters[`arg${index}Description`] = value.description
      parameters[`arg${index}HasDescription`] = value.description ? "yes" : "no"
    }
  })
  const subject = replacements.find(
    (value) => typeof value === "object" && "isPlayer" in value,
  )
  parameters.person =
    typeof subject === "object" && "isPlayer" in subject && subject.isPlayer
      ? "player"
      : "other"
  return formatMessage(message.key, parameters, locale)
}

export const formatLogEntry = (
  entry: LogEntry,
  locale: string = LOCALE,
): string => {
  const turnLabel =
    entry.startTurn !== entry.endTurn
      ? `[${entry.startTurn},${entry.endTurn}]`
      : `[${entry.endTurn}]`
  const countLabel = entry.count > 1 ? ` (x${entry.count})` : ""
  return `${turnLabel} ${formatLogMessage(entry.message, locale)}${countLabel}`
}
