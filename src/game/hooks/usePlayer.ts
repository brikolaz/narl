import { useContext } from "react";
import { getComponentByType } from "../../core/ecs/queries/component";
import { INITIAL_PLAYER_EXP } from "../../utils/constants";
import { ExpComponent } from "../model/components/ExpComponent";
import type { BackpackEntity } from "../model/entities/items/BackpackEntity";
import type { PlayerEntity } from "../model/entities/PlayerEntity";
import { GameContext } from "../state/context";
import { getPlayer } from "../state/selectors";
import { useEq, type Eq } from "./useEq";
import { getBackpack } from "../systems/inv";

type Player = {
  player: PlayerEntity;
  getPlayerBackpack: () => BackpackEntity | undefined;
  exp: number;
  eq: Eq;
};

export const usePlayer = (): Player => {
  const { gameState } = useContext(GameContext);
  const player = getPlayer(gameState);
  const getPlayerBackpack = () => getBackpack(player);
  const eq = useEq(player);

  const exp =
    getComponentByType(player, ExpComponent)?.exp ?? INITIAL_PLAYER_EXP;

  return { player, getPlayerBackpack, exp, eq };
};
