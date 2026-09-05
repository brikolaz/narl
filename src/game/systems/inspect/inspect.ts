import type { Entity } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";

import { getComponentByType, getComponentsByType } from "../../../core/model/queries/components/get";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { InspectDescComponent } from "../../model/components/inspect/InspectDescComponent";
import { InspectedComponent } from "../../model/components/inspect/InspectedComponent";
import { DmgModComponent } from "../../model/components/items/DmgModComponent";
import { isContainer } from "../../model/queries/containers";
import { getInspectedTimes } from "../../model/queries/inspect";
import { isWeapon } from "../../model/queries/weapons";
import {
  getChildrenDmgRange,
  getDmgMod,
  getDmgRange,
  getEffectiveChildrenDmgRange
} from "../attack/dmg";
import { getBonusStats } from "../bonusStats/bonusStats";
import { getEffectiveDef, isArmor } from "../def/def";
import { formatDmgRange } from "../log/format";
import { getEntityName } from "./getEntityName";

export const getInspectDesc = (entity: Entity) => {
  const inspectedTimes = getInspectedTimes(entity);
  const inspectDesc = (getComponentsByType(entity, InspectDescComponent) ?? [])
    .filter(({ times: requiredTimes }) => inspectedTimes >= requiredTimes)
    .sort((a, b) => a.times - b.times);

  return inspectDesc.at(-1)?.text ?? "";
};

const getEffectiveDmgRange = (entity: Entity, eqSlot?: Entity) => {
  const { min, max } = getDmgRange(entity);
  const modifier = eqSlot ? getDmgMod(eqSlot) : 1;
  return {
    min: Math.ceil(min * modifier),
    max: Math.ceil(max * modifier),
  };
};

// todo: move to the renderer
// TODO: fix bug: include slot stats (effective dmg/def range)
export const getItemInspectText = (entity: Entity, eqSlot?: Entity): string => {
  const stats = [];

if (isContainer(entity)) {
  const childrenDmgRange = getChildrenDmgRange(entity);
  const childrenDmgMod = getDmgMod(entity);

  if (childrenDmgRange) {
    const effectiveChildrenDmgRange = getEffectiveChildrenDmgRange(entity)

    const totalDmgRange = getDmgRange(entity)

    stats.push(
      `${formatDmgRange(totalDmgRange)} DMG`
    );

    stats.push(
      `Contents: ${formatDmgRange(effectiveChildrenDmgRange)} DMG ` +
      `(${formatDmgRange(childrenDmgRange)} x${childrenDmgMod})`
    );
  }
} else {
    if (isWeapon(entity)) {
      stats.push(`${formatDmgRange(getEffectiveDmgRange(entity, eqSlot))} DMG`);
    }
  }

  if (isArmor(entity)) {
    stats.push(`${getEffectiveDef(entity, eqSlot)} DEF`);
  }

  const bonusStats = getBonusStats(entity);

  if (bonusStats) {
    const bonusStatsText: string[] = [];

    if (
      hasComponentsByType(bonusStats, DmgModComponent) &&
      getDmgMod(bonusStats) !== DmgModComponent.defaults.dmgMod
    ) {
      bonusStatsText.push(`x${getDmgMod(bonusStats)} DMG`);
    }

    if (bonusStatsText.length > 0) {
      stats.push(`Equip: ${bonusStatsText.join(", ")}`);
    }
  }

  let lines = [];
  lines.push(getEntityName(entity));
  lines.push(getInspectDesc(entity));
  lines.push(stats.join(". "));
  lines = lines.filter(Boolean);

  return lines.join(". ");
};

export const increaseInspected = (item: Entity) => {
  const inspected =
    getComponentByType(item, InspectedComponent) ?? InspectedComponent();
  inspected.times = inspected.times + 1;
  upsertComponents(item, inspected);
};