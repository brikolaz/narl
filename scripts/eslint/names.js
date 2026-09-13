const toWords = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)

export const toConstantCase = (value) =>
  toWords(value)
    .map((word) => word.toUpperCase())
    .join("_")

export const toPascalCase = (value) =>
  value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("")

export const toCamelCase = (value) => value[0].toLowerCase() + value.slice(1)
