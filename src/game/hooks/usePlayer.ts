import { useContext } from "react";
import type { Entity } from "../../core/ecs/Entity";
import {
  getBackpack,
  getContainerItems,
  getContainerSize,
} from "../model/queries/containers";
import { getExp } from "../model/queries/exp";
import { getPlayerEntity } from "../model/queries/player";
import { GameContext } from "../state/context";
import { useEq, type Eq } from "./useEq";

type Player = {
  player: Entity;
  backpack: Entity | undefined;
  exp: number;
  eq: Eq;
  backpackSize: number | undefined;
  items: Entity[];
};

// TODO: add useBackpack
export const usePlayer = (): Player => {
  const { gameState } = useContext(GameContext);
  const player = getPlayerEntity(gameState);
  const backpack = getBackpack(player);
  const eq = useEq(player);
  const backpackSize = backpack ? getContainerSize(backpack) : undefined;
  const items = backpack ? getContainerItems(backpack) : [];

  const exp = getExp(player);

  return { player, backpack, backpackSize, items, exp, eq };
};
