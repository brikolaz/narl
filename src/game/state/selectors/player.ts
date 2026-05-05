import type { PlayerEntity } from "../../model/entities/PlayerEntity";
import type { GameState } from "../state";

export const getPlayer = (state: GameState): PlayerEntity => {
  const player = state.world.find((tile) => tile.player)?.player;
  if (!player) throw new Error("Player not found");
  return player;
};

export const getPlayerPosition = (state: GameState): number => {
  return state.world.findIndex((tile) => tile.player);
};
