import { getComponentCreator } from "../../../../core/model/Component";
import type { Enum, EnumType } from "../../../../utils/types/Enum";

export const Hostility = {
  PEACEFUL: "PEACEFUL",
  HOSTILE: "HOSTILE",
  FRIENDLY_HOSTILE: "FRIENDLY_HOSTILE",
} as const satisfies Enum;
export type Hostility = EnumType<typeof Hostility>;

export type HostilityComponentProps = {
  hostility: Hostility;
};

export const HostilityComponent =
  getComponentCreator<HostilityComponentProps>("HOSTILITY", {
    hostility: Hostility.PEACEFUL,
  });
