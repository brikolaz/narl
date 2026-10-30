import { formatMessage } from "../i18n/messages"
import type { EntityLogProjection } from "../systems/log/types"
import { formatLogMessage } from "./formatLogMessage"
import { formatDmgRange } from "./format"

export const formatItemInspection = (
  projection: EntityLogProjection,
  locale: string,
): string => {
  const {
    name,
    description,
    container,
    dmg,
    def,
    bonusDmgMul,
    slotDmgMul,
    slotDefMul,
  } = projection
  const contents = container?.contents
  const parts = [
    formatMessage(
      "INSPECT.NAME",
      {
        name: typeof name === "string" ? name : formatLogMessage(name, locale),
      },
      locale,
    ),
    description
      ? formatMessage("INSPECT.DESCRIPTION", { description }, locale)
      : undefined,
    container
      ? formatMessage("INSPECT.SIZE", { size: container.size }, locale)
      : undefined,
    container
      ? formatMessage("INSPECT.DEPTH", { depth: container.depth }, locale)
      : undefined,
    dmg
      ? formatMessage(
          "INSPECT.DMG",
          { dmg: String(formatDmgRange(dmg)) },
          locale,
        )
      : undefined,
    contents
      ? formatMessage(
          "INSPECT.CONTENTS",
          {
            dmg: String(formatDmgRange(contents.dmg)),
            baseDmg: String(formatDmgRange(contents.baseDmg)),
            dmgMul: contents.dmgMul,
            def: contents.def,
            defToDmgMul: contents.defToDmgMul ?? 0,
            hasDefConversion: contents.defToDmgMul === undefined ? "no" : "yes",
          },
          locale,
        )
      : undefined,
    def !== undefined
      ? formatMessage("INSPECT.DEF", { def }, locale)
      : undefined,
    slotDmgMul !== undefined
      ? formatMessage(
          "INSPECT.SLOT_DMG_MUL",
          { multiplier: slotDmgMul },
          locale,
        )
      : undefined,
    slotDefMul !== undefined
      ? formatMessage(
          "INSPECT.SLOT_DEF_MUL",
          { multiplier: slotDefMul },
          locale,
        )
      : undefined,
    bonusDmgMul !== undefined
      ? formatMessage("INSPECT.BONUS_DMG", { bonusDmgMul }, locale)
      : undefined,
  ].filter((part) => part !== undefined && part !== "")

  return parts.join(formatMessage("INSPECT.SEPARATOR", {}, locale))
}
