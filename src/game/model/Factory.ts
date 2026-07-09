import type { Entity } from "../../core/ecs/Entity";

export type Factory = {
  getDefault: () => Entity;
  getVariant?: (variant: symbol) => Entity;
  setDroppable?: (entity: Entity) => void;
};

export type ItemFactory = Factory & {
  setDroppable?: (entity: Entity) => void;
};

export type MobFactory = Factory & {};
