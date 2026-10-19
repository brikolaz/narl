import type { LogMessage } from "./types"

export const isMessagesEqual = (left: LogMessage, right: LogMessage): boolean =>
  left.key === right.key &&
  JSON.stringify(left.replacements) === JSON.stringify(right.replacements)
