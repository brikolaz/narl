import type { Entity } from "../../../core/model/Entity"
import { createEnum, type EnumType } from "../../../utils/types/Enum"
import { HpComponent } from "../../model/components/combat/HpComponent"
import { getExp } from "../exp/exp"
import { getHp } from "../hp/hp"

const PlayerStatEnum = createEnum("HP", "EXP")
type PlayerStatEnum = EnumType<typeof PlayerStatEnum>

export type PlayerStats = Record<PlayerStatEnum, string | number>

export const getPlayerStats = (player: Entity): PlayerStats => {
  const hpComponent = getHp(player)

  return {
    [PlayerStatEnum.HP]: `${hpComponent?.hp ?? HpComponent.defaults.hp} / ${hpComponent?.maxHp ?? HpComponent.defaults.maxHp}`,
    [PlayerStatEnum.EXP]: getExp(player),
  }
}
