import type { Entity } from "../../../core/ecs/Entity";
import { hasComponentByType } from "../../../core/ecs/queries/component";
import { DefComponent } from "../../model/components/items/DefComponent";
import { DmgComponent } from "../../model/components/items/DmgComponent";
import { getDef } from "../attack/def";
import { getChildrenDmg, getDmg, getDmgMod, getOwnDmg } from "../attack/dmg";
import { isContainer } from "../inv/containers";
import { getItemName } from "../inv/items";

export const getItemInspectText = (entity: Entity): string => {
  const stats = [];
  if (isContainer(entity)) {
    stats.push(`${getDmg(entity)} TOTAL DMG`);
    stats.push(`${getOwnDmg(entity)} OWN DMG`);
    stats.push(`${getChildrenDmg(entity)} CHILDREN DMG`);
    stats.push(`${getDmgMod(entity)} DMG MOD`);
  } else {
    if (hasComponentByType(entity, DmgComponent)) {
      stats.push(`${getDmg(entity)} DMG`);
    }
     if (hasComponentByType(entity, DefComponent)) {
      stats.push(`${getDef(entity)} DEF`);
    }
  }

  let lines = [];
  lines.push(getItemName(entity));
  lines.push(stats.join(", "));
  lines = lines.filter(Boolean);
  return lines.join(": ");
};
