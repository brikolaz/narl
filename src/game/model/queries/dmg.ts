import { EntityRole, type Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/components/get";
import { getEntitiesByRole } from "../../../core/ecs/queries/entities/get";
import { DmgComponent } from "../components/items/DmgComponent";
import { DmgModComponent } from "../components/items/DmgModComponent";
import { isContainer } from "./containers";

export const getOwnDmg = (entity: Entity): number => {
  return (
    getComponentByType(entity, DmgComponent)?.dmg ?? DmgComponent.defaults.dmg
  );
};

export const getDmgMod = (entity: Entity): number => {
  return (
    getComponentByType(entity, DmgModComponent)?.dmgMod ??
    DmgModComponent.defaults.dmgMod
  );
};

export const getChildrenDmg = (entity: Entity): number => {
  const childrenDmg = getEntitiesByRole(entity, EntityRole.ITEM).reduce(
    (acc, child) => {
      return acc + getDmg(child);
    },
    0,
  );
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
