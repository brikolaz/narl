import type { Entity } from "../../../core/model/Entity";
import { getComponentByType } from "../../../core/model/queries/components/get";
import {
  Hostility,
  HostilityComponent,
} from "../../model/components/ai/HostilityComponent";

export const isHostile = (entity?: Entity) => {
  const hostility = getComponentByType(entity, HostilityComponent)?.hostility;
  return (
    hostility === Hostility.HOSTILE ||
    hostility === Hostility.FRIENDLY_HOSTILE
  );
};

export const isFriendlyHostile = (entity?: Entity) =>
  getComponentByType(entity, HostilityComponent)?.hostility ===
  Hostility.FRIENDLY_HOSTILE;
