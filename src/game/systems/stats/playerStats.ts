import type { Entity } from "../../../core/ecs/Entity";
import { HpComponent } from "../../model/components/mobs/HpComponent";
import { getHp } from "../../model/queries/hp";

enum PlayerStat {
  HP = "HP",
}

export type PlayerStats = Record<PlayerStat, string>;

export const getPlayerStats = (player: Entity): PlayerStats => {
  const hpCompoment = getHp(player);

  return {
    [PlayerStat.HP]: `${hpCompoment?.hp ?? HpComponent.defaults.hp} / ${hpCompoment?.maxHp ?? HpComponent.defaults.maxHp}`,
  };
};
