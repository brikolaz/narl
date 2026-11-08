import { LOCALE } from "../../core/utils/constants"
import { formatMessage } from "../i18n/messages"
import type { LogEntry, LogMessage, LogReplacement } from "../systems/log/types"
import { formatItemInspection } from "./formatItemInspection"

// TODO: simplify this file
const formatReplacement = (
  value: LogReplacement,
  locale: string,
  inspect: boolean,
  pickup: boolean,
): string | readonly string[] => {
  if (typeof value !== "object") return String(value)
  if ("key" in value) return formatLogMessage(value, locale)
  if (!("name" in value))
    return value.map((item) =>
      typeof item === "string" ? item : formatLogMessage(item, locale),
    )
  if (inspect) return formatItemInspection(value, locale)
  if (pickup)
    return formatItemInspection({ ...value, description: "" }, locale, false)
  return value.isPlayer
    ? formatMessage("ENTITY.PLAYER", {}, locale)
    : typeof value.name === "string"
      ? value.name
      : formatLogMessage(value.name, locale)
}

export const formatLogMessage = (
  message: LogMessage,
  locale: string = LOCALE,
): string => {
  const parameters: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(message.parameters ?? {})) {
    parameters[key] =
      typeof value === "object" ? formatLogMessage(value, locale) : value
  }
  const replacements = message.replacements ?? []
  replacements.forEach((value, index) => {
    parameters[`arg${index}`] = formatReplacement(
      value,
      locale,
      message.key === "INSPECT.ITEM" || message.key === "INSPECT.EQ_SLOT",
      message.key === "ITEM.PICKED_UP",
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
