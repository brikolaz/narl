import { describe, expect, it } from "vitest"
import { MessageFormat } from "messageformat"
import { createMessageFormatter, resolveLocale } from "./formatMessage"
import { TEST_MESSAGES } from "./testMessages"
import EN_MESSAGES from "./en.json"

const format = createMessageFormatter<keyof typeof TEST_MESSAGES.en>(
  TEST_MESSAGES,
  "en",
)

describe("formatMessage", () => {
  it.each([
    [[], ""],
    [["Sword"], "Sword"],
    [["Sword", "Axe"], "Sword and Axe"],
    [["{$name}", "{hit|hits}"], "{$name} and {hit|hits}"],
  ])(
    "formats a string list using the message locale: %j",
    (items, expected) => {
      expect(format("list", { items })).toBe(expected)
    },
  )

  it("formats Polish conjunctions using the resolved language", () => {
    expect(
      format("list", { items: ["miecz", "tarcza", "hełm"] }, "pl-PL"),
    ).toBe("miecz, tarcza i hełm")
  })

  it.each(["Sword", ["Sword", 2], undefined])(
    "rejects invalid list input: %j",
    (items) => {
      expect(() => format("list", { items })).toThrow()
    },
  )

  it("uses style and type options from the template", () => {
    expect(
      format("listOptions", {
        items: ["Sword", "Axe"],
        style: "short",
        type: "disjunction",
      }),
    ).toBe("Sword or Axe")
  })

  it.each([
    { style: "invalid", type: "conjunction" },
    { style: "long", type: "invalid" },
  ])("rejects invalid list options: %j", (options) => {
    expect(() =>
      format("listOptions", { items: ["Sword"], ...options }),
    ).toThrow()
  })

  it("interpolates a named argument using MF2 syntax", () => {
    expect(format("greeting", { name: "Ala" })).toBe("Hello, Ala!")
  })

  it.each([
    [0, "No items"],
    [1, "1 item"],
    [2, "2 items"],
    [5, "5 items"],
  ])("selects English plural forms for %s", (count, expected) => {
    expect(format("items", { count })).toBe(expected)
  })

  it.each([
    [0, "Brak przedmiotów"],
    [1, "1 przedmiot"],
    [2, "2 przedmioty"],
    [5, "5 przedmiotów"],
    [12, "12 przedmiotów"],
    [22, "22 przedmioty"],
  ])("selects Polish plural forms for %s", (count, expected) => {
    expect(format("items", { count }, "pl")).toBe(expected)
  })

  it("formats multiple arguments", () => {
    expect(
      format("transfer", {
        source: "Ala",
        target: "Ola",
        count: 2,
        item: "swords",
      }),
    ).toBe("Ala gave 2 swords to Ola.")
  })

  it("allows another language to reorder arguments", () => {
    expect(
      format(
        "transfer",
        { source: "Ala", target: "Ola", count: 2, item: "miecze" },
        "pl",
      ),
    ).toBe("Ala przekazuje Ola: 2 miecze.")
  })

  it("does not parse replacement values as templates", () => {
    expect(format("literals", { first: "{$name}", second: "{hit|hits}" })).toBe(
      "{$name}: {hit|hits} (%)",
    )
  })

  it("resolves a regional locale to its language language", () => {
    expect(format("greeting", { name: "Ala" }, "pl-PL")).toBe("Cześć, Ala!")
  })

  it("falls back to the default language for an unsupported locale", () => {
    expect(format("greeting", { name: "Ala" }, "fr")).toBe("Hello, Ala!")
  })

  it("keeps cached formatters separate for each language", () => {
    expect(format("greeting", { name: "Ala" }, "pl")).toBe("Cześć, Ala!")
    expect(format("greeting", { name: "Ala" }, "en")).toBe("Hello, Ala!")
    expect(format("greeting", { name: "Ola" }, "pl")).toBe("Cześć, Ola!")
  })

  it("rejects a missing argument instead of emitting an MF2 fallback", () => {
    expect(() => format("greeting")).toThrow()
  })

  it("rejects an invalid numeric argument", () => {
    expect(() => format("items", { count: "invalid" })).toThrow()
  })

  it("rejects an unknown runtime key", () => {
    const key = "unknown" as keyof typeof TEST_MESSAGES.en
    expect(() => format(key)).toThrow("Unknown message key: unknown")
  })

  it("rejects a missing default language", () => {
    expect(() => createMessageFormatter(TEST_MESSAGES, "fr")).toThrow(
      "Missing default message language: fr",
    )
  })

  it("rejects malformed MF2 templates", () => {
    const invalid = createMessageFormatter(
      { en: { invalid: "Hello, {$name" } },
      "en",
    )
    expect(() => invalid("invalid", { name: "Ala" })).toThrow()
  })

  it("rejects MF1 syntax instead of interpreting it as MF2", () => {
    const mf1 = createMessageFormatter(
      { en: { mf1: "{count, plural, one {# item} other {# items}}" } },
      "en",
    )
    expect(() => mf1("mf1", { count: 2 })).toThrow()
  })

  describe("createMessageFormatter", () => {
    it("uses the configured default language when no locale is supplied", () => {
      const polish = createMessageFormatter(TEST_MESSAGES, "pl")
      expect(polish("greeting", { name: "Ala" })).toBe("Cześć, Ala!")
    })

    it("formats a literal template without parameters", () => {
      const literal = createMessageFormatter({ en: { literal: "Ready" } }, "en")
      expect(literal("literal")).toBe("Ready")
    })

    it("supports an empty template", () => {
      const empty = createMessageFormatter({ en: { empty: "" } }, "en")
      expect(empty("empty")).toBe("")
    })

    it("keeps cached messages with different keys independent", () => {
      const cached = createMessageFormatter(
        {
          en: {
            first: "First: {$value}",
            second: "Second: {$value}",
          },
        },
        "en",
      )
      expect(cached("first", { value: "A" })).toBe("First: A")
      expect(cached("second", { value: "B" })).toBe("Second: B")
      expect(cached("first", { value: "C" })).toBe("First: C")
    })

    it("keeps separate formatter instances independent", () => {
      const first = createMessageFormatter({ en: { text: "First" } }, "en")
      const second = createMessageFormatter({ en: { text: "Second" } }, "en")
      expect(first("text")).toBe("First")
      expect(second("text")).toBe("Second")
      expect(first("text")).toBe("First")
    })

    it("can format a cached message after an earlier missing argument error", () => {
      const cached = createMessageFormatter(TEST_MESSAGES, "en")
      expect(() => cached("greeting")).toThrow()
      expect(cached("greeting", { name: "Ala" })).toBe("Hello, Ala!")
    })

    it("does not fall back to another language for a missing key", () => {
      const partial = createMessageFormatter(
        {
          en: { greeting: "Hello", onlyEnglish: "English only" },
          pl: { greeting: "Cześć" },
        },
        "en",
      )
      expect(() => partial("onlyEnglish", {}, "pl")).toThrow(
        "Unknown message key: onlyEnglish",
      )
      expect(() => partial("onlyEnglish", {}, "pl-PL")).toThrow(
        "Unknown message key: onlyEnglish",
      )
      expect(partial("onlyEnglish", {}, "en")).toBe("English only")
    })

    it.each([
      "",
      "toString",
      "constructor",
      "section.toString",
      "leaf.child",
      "section.missing",
    ])("rejects invalid or inherited message paths: %s", (key) => {
      const nested = createMessageFormatter(
        { en: { section: { text: "Ready" }, leaf: "Done" } },
        "en",
      )
      expect(() => nested(key)).toThrow(`Unknown message key: ${key}`)
    })

    it("does not accept an inherited default language", () => {
      const languages = { pl: { text: "Polski" } }
      Object.setPrototypeOf(languages, { en: { text: "English" } })
      expect(() => createMessageFormatter(languages, "en")).toThrow(
        "Missing default message language: en",
      )
    })

    it("works with frozen language dictionaries and replacement parameters", () => {
      const languages = Object.freeze({
        en: Object.freeze({
          section: Object.freeze({ greeting: "Hello, {$name}!" }),
        }),
      })
      const parameters = Object.freeze({ name: "Ala" })
      const frozen = createMessageFormatter(languages, "en")
      expect(frozen("section.greeting", parameters)).toBe("Hello, Ala!")
      expect(frozen("section.greeting", parameters)).toBe("Hello, Ala!")
      expect(languages.en.section.greeting).toBe("Hello, {$name}!")
      expect(parameters).toEqual({ name: "Ala" })
    })
  })

  describe("resolveLocale", () => {
    const languages = {
      en: { text: "English: {$value :number}" },
      pl: { text: "Polski: {$value :number}" },
      "pl-PL": { text: "Polska: {$value :number}" },
      zh: { text: "Chinese: {$value :number}" },
      "zh-Hant": { text: "Traditional: {$value :number}" },
    }
    const localized = createMessageFormatter(languages, "en")

    it.each([
      ["en", "English", "en"],
      ["pl", "Polski", "pl"],
      ["pl-PL", "Polska", "pl-PL"],
      ["PL-pl", "Polska", "pl-PL"],
      ["pl-PL-u-nu-latn", "Polska", "pl-PL"],
      ["pl-UA", "Polski", "pl"],
      ["zh-Hant-TW", "Traditional", "zh-Hant"],
      ["zh-Hans-CN", "Chinese", "zh"],
      ["fr-CA", "English", "en"],
      ["fr", "English", "en"],
    ])(
      "resolves %s to %s and uses its numeric locale",
      (requested, label, resolved) => {
        expect(resolveLocale(languages, "en", requested)).toBe(resolved)
        const value = 12345.5
        expect(localized("text", { value }, requested)).toBe(
          `${label}: ${new Intl.NumberFormat(resolved).format(value)}`,
        )
      },
    )

    it("uses the configured default locale for both text and number formatting", () => {
      expect(resolveLocale(languages, "pl", "de-DE")).toBe("pl")
      const polish = createMessageFormatter(languages, "pl")
      const value = 12345.5
      expect(polish("text", { value }, "de-DE")).toBe(
        `Polski: ${new Intl.NumberFormat("pl").format(value)}`,
      )
    })

    it("ignores inherited languages when resolving a requested locale", () => {
      const ownLanguages = { pl: { text: "Polski" } }
      Object.setPrototypeOf(ownLanguages, { en: { text: "English" } })
      expect(resolveLocale(ownLanguages, "pl", "en-US")).toBe("pl")
      const own = createMessageFormatter(ownLanguages, "pl")
      expect(own("text", {}, "en-US")).toBe("Polski")
    })

    it("keeps formatting calls independent after resolving different locales", () => {
      const greeting = createMessageFormatter(TEST_MESSAGES, "en")
      expect(greeting("greeting", { name: "Ala" }, "pl-PL")).toBe("Cześć, Ala!")
      expect(greeting("greeting", { name: "Ola" }, "fr-FR")).toBe("Hello, Ola!")
      expect(greeting("greeting", { name: "Ela" }, "pl")).toBe("Cześć, Ela!")
    })

    it.each(["", "pl_PL", "en--US"])(
      "rejects a malformed locale: %j",
      (locale) => {
        expect(() => resolveLocale(languages, "en", locale)).toThrow(RangeError)
      },
    )
  })

  const getTemplates = (
    language: object,
    prefix: string = "",
  ): [string, string][] =>
    Object.entries(language).flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key
      return typeof value === "string"
        ? [[path, value] as [string, string]]
        : getTemplates(value, path)
    })

  it("resolves message keys through nested language sections", () => {
    const nested = createMessageFormatter<
      "INPUT.PROMPT" | "INPUT.CANCEL" | "INPUT"
    >(
      {
        en: {
          INPUT: {
            PROMPT: "Hello, {$name}!",
            CANCEL: "Canceled",
          } satisfies Record<string, string>,
        },
      },
      "en",
    )
    expect(nested("INPUT.PROMPT", { name: "Ala" })).toBe("Hello, Ala!")
    expect(nested("INPUT.CANCEL")).toBe("Canceled")
    expect(() => nested("INPUT")).toThrow("Unknown message key: INPUT")
  })

  it.each(getTemplates(EN_MESSAGES))(
    "parses production message %s as MF2",
    (_key, source) => {
      expect(() => new MessageFormat("en", source)).not.toThrow()
    },
  )
})
