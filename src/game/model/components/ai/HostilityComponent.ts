import { getComponentCreator } from "../../../../core/model/Component"
import { createEnum, type EnumType } from "../../../../utils/types/Enum"

export const HostilityEnum = createEnum(
  "PEACEFUL",
  "HOSTILE",
  "FRIENDLY_HOSTILE",
)
type HostilityEnum = EnumType<typeof HostilityEnum>

export type HostilityComponentProps = {
  hostility: HostilityEnum
}

export const HostilityComponent = getComponentCreator<HostilityComponentProps>(
  "HOSTILITY",
  {
    hostility: HostilityEnum.PEACEFUL,
  },
)
