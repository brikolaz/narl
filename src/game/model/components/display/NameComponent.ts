import type { MessageKey } from "../../../i18n/types"
import { getComponentCreator } from "../../../../core/model/Component"

export type NameComponentProps = {
  name: MessageKey
}

export const NameComponent = getComponentCreator<NameComponentProps>("NAME", {
  name: "ENTITY.UNKNOWN",
})
