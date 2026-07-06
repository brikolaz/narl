import type { Entity } from "../../core/ecs/Entity";

export type Factory = {
  getDefault: () => Entity;
};
