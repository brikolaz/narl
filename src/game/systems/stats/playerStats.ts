import { HpComponent } from "../../model/components/mobs/HpComponent";
import { PlayerEntity } from "../../model/entities/PlayerEntity";
import { getHp } from "../../model/queries/hp";

enum PlayerStat {
  HP = "HP",
}

export type PlayerStats = Record<PlayerStat, string>;

export const getPlayerStats = (player: PlayerEntity): PlayerStats => {
  const hpCompoment = getHp(player);

  return {
    [PlayerStat.HP]: `${hpCompoment?.hp ?? HpComponent.DEFAULT_HP} / ${hpCompoment?.maxHp ?? HpComponent.DEFAULT_MAX_HP}`,
  };
};
