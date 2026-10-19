import { MessageFormat } from "messageformat"
import { list } from "./list"

type MessageLanguageTree = {
  readonly [key: string]: string | MessageLanguageTree
}

export const resolveLocale = (
  languages: Readonly<Record<string, MessageLanguageTree>>,
  defaultLocale: string,
  locale: string,
): string => {
  const requestedLocale = Intl.getCanonicalLocales(locale)[0]
  let resolvedLocale = requestedLocale

  while (
    !Object.hasOwn(languages, resolvedLocale) &&
    resolvedLocale.includes("-")
  ) {
    resolvedLocale = resolvedLocale.slice(0, resolvedLocale.lastIndexOf("-"))
  }

  if (!Object.hasOwn(languages, resolvedLocale)) {
    resolvedLocale = defaultLocale
  }

  return resolvedLocale
}

export const createMessageFormatter = <Key extends string>(
  languages: Readonly<Record<string, MessageLanguageTree>>,
  defaultLocale: string,
) => {
  if (!Object.hasOwn(languages, defaultLocale)) {
    throw new Error(`Missing default message language: ${defaultLocale}`)
  }

  const cache = new Map<string, Map<Key, MessageFormat<"string">>>()

  return (
    key: Key,
    parameters: Record<string, unknown> = {},
    locale: string = defaultLocale,
  ): string => {
    const resolvedLocale = resolveLocale(languages, defaultLocale, locale)

    let message: string | MessageLanguageTree = languages[resolvedLocale]

    for (const segment of key.split(".")) {
      if (typeof message === "string" || !Object.hasOwn(message, segment)) {
        throw new Error(`Unknown message key: ${key}`)
      }
      message = message[segment]
    }

    if (typeof message !== "string") {
      throw new Error(`Unknown message key: ${key}`)
    }

    let messages = cache.get(resolvedLocale)
    if (!messages) {
      messages = new Map()
      cache.set(resolvedLocale, messages)
    }

    let formatter = messages.get(key)
    if (!formatter) {
      formatter = new MessageFormat(resolvedLocale, message, {
        bidiIsolation: "none",
        functions: { list },
      })
      messages.set(key, formatter)
    }

    return formatter.format(parameters, (error) => {
      throw error
    })
  }
}
