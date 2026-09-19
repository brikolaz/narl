import { getComponentCreator } from "../../../core/model/Component"

type HealComponentProps = {
  min: number
  max: number
}

export const HealComponent = getComponentCreator<HealComponentProps>("HEAL", {
  min: 0,
  max: 0,
})
