import { EntityRole, type Entity } from "../../../core/model/Entity";
import {
  getComponentByType,
  getComponentsByType,
} from "../../../core/model/queries/components/get";
import { getEntitiesByRole } from "../../../core/model/queries/entities/get";
import { DefComponent } from "../components/items/DefComponent";
import { DefModComponent } from "../components/items/DefModComponent";
import { isContainer } from "./containers";

export const getOwnDef = (entity?: Entity): number => {
  return getComponentsByType(entity, DefComponent).reduce(
    (total, component) => total + component.def,
    DefComponent.defaults.def,
  );
};

export const getDefMod = (entity: Entity): number => {
  return (
    getComponentByType(entity, DefModComponent)?.defMod ??
    DefModComponent.defaults.defMod
  );
};

export const getDef = (entity?: Entity): number => {
  if (!entity) {
    return DefComponent.defaults.def;
  }

  const ownDef = getOwnDef(entity);
  if (!isContainer(entity)) {
    return ownDef;
  }

  const childrenDef = getEntitiesByRole(entity, EntityRole.ITEM).reduce(
    (def, child) => def + getDef(child),
    0,
  );
  return Math.ceil(ownDef + childrenDef * getDefMod(entity));
};
