import { LOCALE } from "../../core/utils/constants"
import { MESSAGE_LANGUAGES } from "./languages"
import { createMessageFormatter } from "./formatMessage"
import type { MessageKey } from "./types"

const messageFormatter = createMessageFormatter<MessageKey>(
  MESSAGE_LANGUAGES,
  LOCALE,
)

export const formatMessage = (
  key: MessageKey,
  parameters: Record<string, unknown> = {},
  locale: string = LOCALE,
): string => messageFormatter(key, parameters, locale)
