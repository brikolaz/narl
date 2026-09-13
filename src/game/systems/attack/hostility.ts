import type { Entity } from "../../../core/model/Entity"
import { getComponentByType } from "../../../core/model/queries/components/get"
import {
  HostilityEnum,
  HostilityComponent,
} from "../../model/components/ai/HostilityComponent"

export const isHostile = (entity?: Entity) => {
  const hostility = getComponentByType(entity, HostilityComponent)?.hostility
  return (
    hostility === HostilityEnum.HOSTILE ||
    hostility === HostilityEnum.FRIENDLY_HOSTILE
  )
}

export const isFriendlyHostile = (entity?: Entity) =>
  getComponentByType(entity, HostilityComponent)?.hostility ===
  HostilityEnum.FRIENDLY_HOSTILE
