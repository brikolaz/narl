import { EntityRole, type Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { getEntitiesByRole } from "../../../core/model/queries/entities/get";
import { DmgComponent } from "../../model/components/items/DmgComponent";
import { DmgModComponent } from "../../model/components/items/DmgModComponent";
import { isContainer } from "../../model/queries/containers";
import { getBonusDmgMod } from "../bonusStats/bonusStats";
import { getRng } from "../rng/rng";
import { getAttackWeapon } from "./getAttackWeapon";

export type DmgRange = { min: number; max: number };

const addDmgRanges = (left: DmgRange, right: DmgRange): DmgRange => ({
  min: left.min + right.min,
  max: left.max + right.max,
});

const getOwnDmgRange = (entity: Entity): DmgRange => {
  const dmg = getComponentByType(entity, DmgComponent);
  return {
    min: dmg?.min ?? DmgComponent.defaults.min,
    max: dmg?.max ?? DmgComponent.defaults.max,
  };
};

export const getDmgMod = (entity: Entity): number => {
  return (
    getComponentByType(entity, DmgModComponent)?.dmgMod ??
    DmgModComponent.defaults.dmgMod
  );
};

export const getBaseChildrenDmgRange = (entity: Entity): DmgRange => {
  return getEntitiesByRole(entity, EntityRole.ITEM).reduce(
    (range, child) => addDmgRanges(range, getDmgRange(child)),
    { min: DmgComponent.defaults.min, max: DmgComponent.defaults.max },
  );
};

export const getChildrenDmgRange = (entity: Entity): DmgRange => {
  const childrenDmg = getBaseChildrenDmgRange(entity)
  const dmgMod = getDmgMod(entity);

  return {
    min: Math.ceil(childrenDmg.min * dmgMod),
    max: Math.ceil(childrenDmg.max * dmgMod),
  };
}

export const getDmgRange = (entity: Entity): DmgRange => {
  const ownDmg = getOwnDmgRange(entity);

  if (!isContainer(entity)) {
    return ownDmg;
  }

  const childrenDmg = getBaseChildrenDmgRange(entity);
  const dmgMod = getDmgMod(entity);
  return {
    min: Math.ceil(ownDmg.min + childrenDmg.min * dmgMod),
    max: Math.ceil(ownDmg.max + childrenDmg.max * dmgMod),
  };
};

export const getAttackDmgRange = (source: Entity): DmgRange => {
  const weapon = getAttackWeapon(source);
  if (!weapon) {
    return DmgComponent.defaults;
  }

  const bonusDmgMod = getBonusDmgMod(source)

  const weaponDmg = getDmgRange(weapon);

  return {
    min: Math.ceil(weaponDmg.min * bonusDmgMod),
    max: Math.ceil(weaponDmg.max * bonusDmgMod),
  };
};

export const rollAttackDmg = (source: Entity): number => {
  const { min, max } = getAttackDmgRange(source)
  return getRng(source).range(min, max)
};
