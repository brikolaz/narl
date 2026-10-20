import { getComponentByType } from "../../../core/model/queries/components/get"
import type { EntityArgument } from "../../../core/model/queries/entities/normalize"
import type { LogMessage } from "../log/types"
import { NameComponent } from "../../model/components/display/NameComponent"
import { isCursed } from "../curse/curse"

export const getEntityName = (entity?: EntityArgument): LogMessage => {
  const component = getComponentByType(entity, NameComponent)
  const name: LogMessage = {
    key: component?.name ?? NameComponent.defaults.name,
  }
  return entity && component && isCursed(entity)
    ? { key: "ENTITY.CURSED_NAME", parameters: { name } }
    : name
}
