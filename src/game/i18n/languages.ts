import EN_MESSAGES from "./en.json"
import type { MessageLanguage } from "./types"

export const MESSAGE_LANGUAGES: Readonly<Record<string, MessageLanguage>> = {
  en: EN_MESSAGES,
}
