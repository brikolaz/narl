import { useContext } from "react";
import { GameContext } from "../state/context";
import { getPlayer } from "../state/selectors";
import type { PlayerEntity } from "../model/entities/PlayerEntity";
import { getBackpack } from "../systems/pickUp";
import type { BackpackEntity } from "../model/entities/BackpackEntity";
import { getComponentByType } from "../../core/ecs/queries/component";
import { ExpComponent } from "../model/components/ExpComponent";
import { INITIAL_PLAYER_EXP } from "../../utils/constants";

type Player = {
  player: PlayerEntity;
  getPlayerBackpack: () => BackpackEntity | undefined;
  exp: number;
};

export const usePlayer = (): Player => {
  const { gameState } = useContext(GameContext);
  const player = getPlayer(gameState);
  const getPlayerBackpack = () => getBackpack(player);
  const exp =
    getComponentByType(player, ExpComponent)?.exp ?? INITIAL_PLAYER_EXP;

  return { player, getPlayerBackpack, exp };
};
