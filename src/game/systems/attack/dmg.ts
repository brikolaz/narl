import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { DmgComponent } from "../../model/components/items/DmgComponent";
import { DmgModComponent } from "../../model/components/items/DmgModComponent";
import { isContainer } from "../inv/containers";

export const getOwnDmg = (entity: Entity): number => {
  return getComponentByType(entity, DmgComponent)?.dmg ?? 0;
};

export const getDmgMod = (entity: Entity): number => {
  return getComponentByType(entity, DmgModComponent)?.dmgMod ?? 1;
};

export const getChildrenDmg = (entity: Entity): number => {
  const childrenDmg = entity.entities.reduce((acc, child) => {
    return acc + getDmg(child);
  }, 0);
  return childrenDmg;
};

export const getDmg = (entity: Entity): number => {
  const ownDmg = getOwnDmg(entity);

  if (!isContainer(entity)) {
    return ownDmg;
  }

  const childrenDmg = getChildrenDmg(entity);
  const totalDmg = (ownDmg + childrenDmg) * getDmgMod(entity);
  return Math.ceil(totalDmg);
};
