import { getComponentCreator } from "../../../../core/model/Component"
type ProvokableComponentProps = { dmgChance: number; pokeChance: number }
export const ProvokableComponent =
  getComponentCreator<ProvokableComponentProps>("PROVOKABLE", {
    dmgChance: 0,
    pokeChance: 0,
  })
