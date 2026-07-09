import type { Component } from "../../../core/ecs/Component";
import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/components/get";
import {
  HpComponent,
  type HpComponentProps,
} from "../components/mobs/HpComponent";

export const getHp = (entity: Entity): Component<HpComponentProps> => {
  const hpComponent = getComponentByType(entity, HpComponent);

  if (!hpComponent) {
    throw new Error(`Entity does not have an HpComponent`);
  }

  return hpComponent;
};
