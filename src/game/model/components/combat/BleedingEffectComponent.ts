import { getComponentCreator } from "../../../../core/model/Component"
type BleedingEffectComponentProps = {
  chance: number
  min: number
  max: number
  duration: number
}
export const BleedingEffectComponent =
  getComponentCreator<BleedingEffectComponentProps>("BLEEDING_EFFECT", {
    chance: 0,
    min: 0,
    max: 0,
    duration: 0,
  })
