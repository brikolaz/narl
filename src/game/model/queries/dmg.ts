import { EntityRole, type Entity } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { patchComponentByType } from "../../../core/model/queries/components/patch";
import { getEntitiesByRole } from "../../../core/model/queries/entities/get";
import { DmgComponent } from "../components/items/DmgComponent";
import { DmgModComponent } from "../components/items/DmgModComponent";
import { isContainer } from "./containers";

export type DmgRange = { min: number; max: number };

const addDmgRanges = (left: DmgRange, right: DmgRange): DmgRange => ({
  min: left.min + right.min,
  max: left.max + right.max,
});

export const formatDmgRange = ({ min, max }: DmgRange): number | string =>
  min === max ? min : `${min}-${max}`;

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
  return entity.rng.range(min, max);
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

export const setDmg = (entity: Entity, min: number, max?: number) => {
  if (!hasComponentsByType(entity, DmgComponent)) {
    upsertComponents(entity, DmgComponent());
  }
  patchComponentByType(entity, DmgComponent, (component) => {
    component.min = min;
    component.max = max ?? min;
  });
};
