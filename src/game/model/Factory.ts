import type { Entity } from "../../core/ecs/Entity";
import type { Enum } from "../../core/ecs/Enum";

export type Factory<V extends Enum = Enum> = {
  getDefault(): Entity;
  getVariant?(variant: V[keyof V]): Entity;
};

export type ItemFactory = Factory & {
  setDroppable?: (entity: Entity) => void;
};

export type MobFactory = Factory & {};
