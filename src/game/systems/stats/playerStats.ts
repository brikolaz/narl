import type { Entity } from "../../../core/model/Entity";
import type { Enum, EnumType } from "../../../utils/types/Enum";
import { HpComponent } from "../../model/components/mobs/HpComponent";
import { getExp } from "../../model/queries/exp";
import { getHp } from "../../model/queries/hp";

const PlayerStat = {
  HP: "HP",
  EXP: "EXP",
} as const satisfies Enum;
type PlayerStat = EnumType<typeof PlayerStat>;

export type PlayerStats = Record<PlayerStat, string | number>;

export const getPlayerStats = (player: Entity): PlayerStats => {
  const hpComponent = getHp(player);

  return {
    [PlayerStat.HP]: `${hpComponent?.hp ?? HpComponent.defaults.hp} / ${hpComponent?.maxHp ?? HpComponent.defaults.maxHp}`,
    [PlayerStat.EXP]: getExp(player),
  };
};
