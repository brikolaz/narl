import { EntityRole, type Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { getEntitiesByRole } from "../../../core/model/queries/entities/get";
import { DmgComponent } from "../../model/components/items/DmgComponent";
import { DmgModComponent } from "../../model/components/items/DmgModComponent";
import { isContainer } from "../../model/queries/containers";
import { getAllBonusStats } from "../bonusStats/bonusStats";
import { getRng } from "../rng/rng";
import { getAttackWeapon } from "./getAttackWeapon";

export type DmgRange = { min: number; max: number };

type EntityDmgRangeGetter = (entity: Entity) => DmgRange;

const addDmgRanges = (left: DmgRange, right: DmgRange): DmgRange => ({
  min: left.min + right.min,
  max: left.max + right.max,
});

export const getOwnDmgRange = (entity: Entity): DmgRange => {
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

export const getChildrenDmgRange = (entity: Entity): DmgRange => {
  return getEntitiesByRole(entity, EntityRole.ITEM).reduce(
    (range, child) => addDmgRanges(range, getDmgRange(child)),
    { min: 0, max: 0 },
  );
};

export const getEffectiveChildrenDmgRange = (entity: Entity): DmgRange => {
  const childrenDmg = getChildrenDmgRange(entity)
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

  const childrenDmg = getChildrenDmgRange(entity);
  const dmgMod = getDmgMod(entity);
  return {
    min: Math.ceil(ownDmg.min + childrenDmg.min * dmgMod),
    max: Math.ceil(ownDmg.max + childrenDmg.max * dmgMod),
  };
};

const rollOwnDmg = (entity: Entity): number => {
  const { min, max } = getOwnDmgRange(entity);
  return getRng(entity).range(min, max);
};

export const rollDmg = (entity: Entity): number => {
  const ownDmg = rollOwnDmg(entity);

  if (!isContainer(entity)) {
    return ownDmg;
  }

  const childrenDmg = getEntitiesByRole(entity, EntityRole.ITEM).reduce(
    (dmg, child) => dmg + rollDmg(child),
    0,
  );
  return Math.ceil(ownDmg + childrenDmg * getDmgMod(entity));
};

const calculateAttackDmgRange = (
  source: Entity,
  getEntityDmgRange: EntityDmgRangeGetter,
): DmgRange => {
  const weapon = getAttackWeapon(source);
  if (!weapon) {
    return DmgComponent.defaults;
  }

  const bonusStats = getAllBonusStats(source);
  const dmgMod = bonusStats.reduce(
    (modifier, stats) => modifier * getDmgMod(stats),
    1,
  );
  const weaponDmg = getEntityDmgRange(weapon);

  return {
    min: Math.ceil(weaponDmg.min * dmgMod),
    max: Math.ceil(weaponDmg.max * dmgMod),
  };
};

export const getAttackDmgRange = (source: Entity): DmgRange => {
  return calculateAttackDmgRange(source, getDmgRange);
};

export const rollAttackDmg = (source: Entity): number => {
  return calculateAttackDmgRange(source, (entity) => {
    const dmg = rollDmg(entity);
    return { min: dmg, max: dmg };
  }).min;
};
