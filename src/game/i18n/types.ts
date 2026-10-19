import type EN_MESSAGES from "./en.json"

type MessageKeys<Language> = {
  [Key in keyof Language & string]: Language[Key] extends string
    ? Key
    : `${Key}.${MessageKeys<Language[Key]>}`
}[keyof Language & string]

type LanguageStrings<Language> = {
  readonly [Key in keyof Language]: Language[Key] extends string
    ? string
    : LanguageStrings<Language[Key]>
}

export type MessageKey = MessageKeys<typeof EN_MESSAGES>
export type MessageLanguage = LanguageStrings<typeof EN_MESSAGES>
