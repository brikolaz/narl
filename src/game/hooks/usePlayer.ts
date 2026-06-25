import { useContext } from "react";
import { getComponentByType } from "../../core/ecs/queries/component";
import { INITIAL_PLAYER_EXP } from "../../utils/constants";
import { ExpComponent } from "../model/components/mobs/ExpComponent";
import type { BackpackEntity } from "../model/entities/items/BackpackEntity";
import type { PlayerEntity } from "../model/entities/PlayerEntity";
import { GameContext } from "../state/context";
import { useEq, type Eq } from "./useEq";
import { ItemEntity } from "../model/entities/items/ItemEntity";
import { getBackpack, getContainerSize } from "../model/queries/containers";
import { getEntitiesByType } from "../../core/ecs/queries/entities";
import { getPlayerEntity } from "../model/queries/player";

type Player = {
  player: PlayerEntity;
  backpack: BackpackEntity | undefined;
  exp: number;
  eq: Eq;
  backpackSize: number | undefined;
  items: ItemEntity[];
};

// TODO: add useBackpack
export const usePlayer = (): Player => {
  const { gameState } = useContext(GameContext);
  const player = getPlayerEntity(gameState);
  const backpack = getBackpack(player);
  const eq = useEq(player);
  const backpackSize = backpack ? getContainerSize(backpack) : undefined;
  const items = getEntitiesByType(backpack, ItemEntity);

  const exp =
    getComponentByType(player, ExpComponent)?.exp ?? INITIAL_PLAYER_EXP;

  return { player, backpack, backpackSize, items, exp, eq };
};
