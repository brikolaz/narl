import type { Entity } from "../../../core/ecs/Entity";

import { InspectDescComponent } from "../../model/components/inspect/InspectDescComponent";
import { InspectedComponent } from "../../model/components/inspect/InspectedComponent";
import { DefComponent } from "../../model/components/items/DefComponent";
import { getDef } from "../../model/queries/def";
import {
  getChildrenDmg,
  getDmg,
  getDmgMod,
  getOwnDmg,
} from "../../model/queries/dmg";
import { isContainer } from "../../model/queries/containers";
import { getInspectedTimes } from "../../model/queries/inspect";
import { isWeapon } from "../../model/queries/weapons";
import { getEntityName } from "./getEntityName";
import { getComponentByType, getComponentsByType } from "../../../core/ecs/queries/components/get";
import { hasComponentsByType } from "../../../core/ecs/queries/components/has";
import { upsertComponents } from "../../../core/ecs/queries/components/add";

const getInspectDesc = (entity: Entity) => {
  const inspectedTimes = getInspectedTimes(entity);
  if (!inspectedTimes) {
    return "";
  }
  const inspectDesc = (getComponentsByType(entity, InspectDescComponent) ?? [])
    .filter(({ times: requiredTimes }) => inspectedTimes >= requiredTimes)
    .sort((a, b) => a.times - b.times);

  return inspectDesc.at(-1)?.text ?? "";
};

export const getItemInspectText = (entity: Entity): string => {
  const stats = [];
  if (isContainer(entity)) {
    stats.push(`${getDmg(entity)} TOTAL DMG`);
    stats.push(`${getOwnDmg(entity)} OWN DMG`);
    stats.push(`${getChildrenDmg(entity)} CHILDREN DMG`);
    stats.push(`${getDmgMod(entity)} DMG MOD`);
  } else {
    if (isWeapon(entity)) {
      stats.push(`${getDmg(entity)} DMG`);
    }
    if (hasComponentsByType(entity, DefComponent)) {
      stats.push(`${getDef(entity)} DEF`);
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
