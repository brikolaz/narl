import type { Entity } from "../Entity";

export const clone = <T>(obj: T): T =>
  Object.assign(
    Object.create(Object.getPrototypeOf(obj)),
    obj
  );

export const cloneEntity = (entity: Entity): Entity => ({
  ...entity,
  components: entity.components.map(clone),
  entities: entity.entities.map(cloneEntity),
});