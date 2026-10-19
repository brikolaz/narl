import type { MessageKey } from "../../i18n/types"
import type { LogMessage, LogReplacement } from "./types"

export const createLogMessage = (
  key: MessageKey,
  replacements?: readonly LogReplacement[],
): LogMessage => ({ key, replacements })
