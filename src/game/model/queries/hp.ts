import type { Component } from "../../../core/model/Component";
import { getComponentByType } from "../../../core/model/queries/components/get";
import type { EntityArgument } from "../../../core/model/queries/entities/normalize";
import {
  HpComponent,
  type HpComponentProps,
} from "../components/mobs/HpComponent";

export const getHp = (entity: EntityArgument): Component<HpComponentProps> => {
  const hpComponent = getComponentByType(entity, HpComponent);

  if (!hpComponent) {
    throw new Error(`Entity does not have an HpComponent`);
  }

  return hpComponent;
};
