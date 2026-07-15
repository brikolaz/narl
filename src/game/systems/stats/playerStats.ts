import type { Entity } from "../../../core/ecs/Entity";
import { HpComponent } from "../../model/components/mobs/HpComponent";
import { getExp } from "../../model/queries/exp";
import { getHp } from "../../model/queries/hp";

enum PlayerStat {
  HP = "HP",
  EXP = "EXP",
}

export type PlayerStats = Record<PlayerStat, string | number>;

export const getPlayerStats = (player: Entity): PlayerStats => {
  const hpComponent = getHp(player);

  return {
    [PlayerStat.HP]: `${hpComponent?.hp ?? HpComponent.defaults.hp} / ${hpComponent?.maxHp ?? HpComponent.defaults.maxHp}`,
    [PlayerStat.EXP]: getExp(player),
  };
};
