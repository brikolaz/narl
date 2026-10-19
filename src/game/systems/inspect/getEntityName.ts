import { getComponentByType } from "../../../core/model/queries/components/get"
import type { EntityArgument } from "../../../core/model/queries/entities/normalize"
import { formatMessage } from "../../i18n/messages"
import { NameComponent } from "../../model/components/display/NameComponent"
import { isCursed } from "../curse/curse"

export const getEntityName = (entity?: EntityArgument): string => {
  const component = getComponentByType(entity, NameComponent)
  const name = formatMessage(component?.name ?? NameComponent.defaults.name)
  return entity && component && isCursed(entity)
    ? formatMessage("ENTITY.CURSED_NAME", { name })
    : name
}
