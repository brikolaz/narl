import type { Entity } from "../../core/model/Entity";
import type { Enum } from "../../utils/types/Enum";

export type Factory<V extends Enum = Enum> = {
  getDefault(): Entity;
  getVariant?(variant: V[keyof V]): Entity;
};

export type ItemFactory = Factory & {
  setDroppable?: (entity: Entity) => void;
};

export type MobFactory = Factory & {};
