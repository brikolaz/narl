import { getComponentCreator } from "../../../../core/model/Component"
type ProvokableComponentProps = { damageChance: number; pokeChance: number }
export const ProvokableComponent =
  getComponentCreator<ProvokableComponentProps>("PROVOKABLE", {
    damageChance: 0,
    pokeChance: 0,
  })
