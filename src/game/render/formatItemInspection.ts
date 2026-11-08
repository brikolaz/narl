import { formatMessage } from "../i18n/messages"
import type { DmgRange } from "../systems/attack/dmg"
import type { EntityLogProjection } from "../systems/log/types"
import { formatLogMessage } from "./formatLogMessage"
import { formatDmgRange } from "./format"

const hasStatValue = (value: number | undefined): value is number =>
  value !== undefined && value !== 0

const hasDmgValue = (value: DmgRange | undefined): value is DmgRange =>
  value !== undefined && (value.min !== 0 || value.max !== 0)

const formatContents = (
  container: EntityLogProjection["container"],
  locale: string,
): string | undefined => {
  const contents = container?.contents
  if (!contents) return undefined

  const terms = [
    hasDmgValue(contents.baseDmg) && hasStatValue(contents.dmgMul)
      ? formatMessage(
          "INSPECT.CONTENTS_DMG_TERM",
          {
            dmg: String(formatDmgRange(contents.baseDmg)),
            multiplier: contents.dmgMul,
          },
          locale,
        )
      : undefined,
    hasStatValue(contents.def) && hasStatValue(contents.defToDmgMul)
      ? formatMessage(
          "INSPECT.CONTENTS_DEF_TERM",
          {
            def: contents.def,
            multiplier: contents.defToDmgMul,
          },
          locale,
        )
      : undefined,
  ].filter((term) => term !== undefined)
  const stats = [
    hasDmgValue(contents.dmg)
      ? terms.length
        ? formatMessage(
            "INSPECT.CONTENTS_DMG",
            {
              dmg: String(formatDmgRange(contents.dmg)),
              terms: terms.join(
                formatMessage("INSPECT.TERM_SEPARATOR", {}, locale),
              ),
            },
            locale,
          )
        : formatMessage(
            "INSPECT.DMG",
            { dmg: String(formatDmgRange(contents.dmg)) },
            locale,
          )
      : undefined,
    hasStatValue(contents.effectiveDef)
      ? hasStatValue(contents.def) && hasStatValue(contents.defMul)
        ? formatMessage(
            "INSPECT.CONTENTS_DEF",
            {
              def: contents.effectiveDef,
              terms: formatMessage(
                "INSPECT.CONTENTS_DEF_TERM",
                {
                  def: contents.def,
                  multiplier: contents.defMul,
                },
                locale,
              ),
            },
            locale,
          )
        : formatMessage("INSPECT.DEF", { def: contents.effectiveDef }, locale)
      : undefined,
  ].filter((stat) => stat !== undefined)

  return stats.length
    ? formatMessage(
        "INSPECT.CONTENTS",
        {
          stats: stats.join(
            formatMessage("INSPECT.STAT_SEPARATOR", {}, locale),
          ),
        },
        locale,
      )
    : undefined
}

export const formatItemInspection = (
  projection: EntityLogProjection,
  locale: string,
  showCurrentSize = true,
): string => {
  const {
    name,
    description,
    container,
    dmg,
    def,
    bonusStats,
    slotDmgMul,
    slotDefMul,
  } = projection
  const statSeparator = formatMessage("INSPECT.STAT_SEPARATOR", {}, locale)
  const sectionSeparator = formatMessage("INSPECT.SEPARATOR", {}, locale)
  const stats = [
    container && hasStatValue(container.size)
      ? formatMessage(
          showCurrentSize ? "INSPECT.CURRENT_SIZE" : "INSPECT.SIZE",
          { currentSize: container.currentSize ?? 0, size: container.size },
          locale,
        )
      : undefined,
    container && hasStatValue(container.depth)
      ? formatMessage("INSPECT.DEPTH", { depth: container.depth }, locale)
      : undefined,
    hasDmgValue(dmg)
      ? formatMessage(
          "INSPECT.DMG",
          { dmg: String(formatDmgRange(dmg)) },
          locale,
        )
      : undefined,
    hasStatValue(def)
      ? formatMessage("INSPECT.DEF", { def }, locale)
      : undefined,
    hasStatValue(slotDmgMul)
      ? formatMessage(
          "INSPECT.SLOT_DMG_MUL",
          { multiplier: slotDmgMul },
          locale,
        )
      : undefined,
    hasStatValue(slotDefMul)
      ? formatMessage(
          "INSPECT.SLOT_DEF_MUL",
          { multiplier: slotDefMul },
          locale,
        )
      : undefined,
  ].filter((stat) => stat !== undefined)
  const bonuses = [
    hasStatValue(bonusStats?.dmgMul)
      ? formatMessage(
          "INSPECT.BONUS_DMG",
          { bonusDmgMul: bonusStats.dmgMul },
          locale,
        )
      : undefined,
    hasStatValue(bonusStats?.defMul)
      ? formatMessage(
          "INSPECT.BONUS_DEF",
          { bonusDefMul: bonusStats.defMul },
          locale,
        )
      : undefined,
  ].filter((bonus) => bonus !== undefined)
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
    stats.length
      ? stats.join(container ? statSeparator : sectionSeparator)
      : undefined,
    formatContents(container, locale),
    bonuses.length
      ? formatMessage(
          "INSPECT.EQUIP",
          { stats: bonuses.join(statSeparator) },
          locale,
        )
      : undefined,
  ].filter((part) => part !== undefined && part !== "")

  return parts.join(sectionSeparator)
}
