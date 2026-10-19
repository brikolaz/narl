import type { MessageFunction } from "messageformat/functions"

export const list: MessageFunction<"string"> = (context, options, input) => {
  if (
    !Array.isArray(input) ||
    !input.every((item) => typeof item === "string")
  ) {
    throw new TypeError(":list requires an array of strings")
  }
  const style = options.style ?? "long"
  const type = options.type ?? "conjunction"
  if (style !== "long" && style !== "short" && style !== "narrow") {
    throw new TypeError("Invalid :list style")
  }
  if (type !== "conjunction" && type !== "disjunction" && type !== "unit") {
    throw new TypeError("Invalid :list type")
  }
  const value = new Intl.ListFormat(context.locales, {
    style,
    type,
    localeMatcher: context.localeMatcher,
  }).format(input)
  return { type: "string", toString: () => value }
}
