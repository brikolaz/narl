import type { Entity } from "../../../core/model/Entity";

import { InspectDescComponent } from "../../model/components/inspect/InspectDescComponent";
import { InspectedComponent } from "../../model/components/inspect/InspectedComponent";
import { DefComponent } from "../../model/components/items/DefComponent";
import { getDef, getDefMod } from "../../model/queries/def";
import {
  getChildrenDmgRange,
  getDmgRange,
  getDmgMod,
  getOwnDmgRange,
} from "../hit/dmg";
import { isContainer } from "../../model/queries/containers";
import { getInspectedTimes } from "../../model/queries/inspect";
import { isWeapon } from "../../model/queries/weapons";
import { getEntityName } from "./getEntityName";
import { getComponentByType, getComponentsByType } from "../../../core/model/queries/components/get";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { formatDmgRange } from "../log/format";

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

const getEffectiveDef = (entity: Entity, eqSlot?: Entity) => {
  return Math.ceil(getDef(entity) * (eqSlot ? getDefMod(eqSlot) : 1));
};

export const getItemInspectText = (entity: Entity, eqSlot?: Entity): string => {
  const stats = [];
  if (isContainer(entity)) {
    stats.push(`${formatDmgRange(getEffectiveDmgRange(entity, eqSlot))} TOTAL DMG`);
    stats.push(`${formatDmgRange(getOwnDmgRange(entity))} OWN DMG`);
    stats.push(
      `${formatDmgRange(getChildrenDmgRange(entity))} CHILDREN DMG`,
    );
    stats.push(`${getDmgMod(entity)} DMG MOD`);
  } else {
    if (isWeapon(entity)) {
      stats.push(`${formatDmgRange(getEffectiveDmgRange(entity, eqSlot))} DMG`);
    }
    if (hasComponentsByType(entity, DefComponent)) {
      stats.push(`${getEffectiveDef(entity, eqSlot)} DEF`);
    }
  }

  let lines = [];
  lines.push(getEntityName(entity));
  lines.push(getInspectDesc(entity));
  lines.push(stats.join(", "));
  lines = lines.filter(Boolean);
  return lines.join(". ");
};

export const increaseInspected = (item: Entity) => {
  const inspected =
    getComponentByType(item, InspectedComponent) ?? InspectedComponent();
  inspected.times = inspected.times + 1;
  upsertComponents(item, inspected);
};
