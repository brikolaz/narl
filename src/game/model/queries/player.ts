import type { Entity } from "../../../core/ecs/Entity";
import type { GameState, PlayerState } from "../../state/state";

export const getPlayer = (state: GameState): PlayerState => {
  if (!state.player) {
    throw new Error("Player state is not initialized");
  }
  return state.player;
};

export const getPlayerEntity = (state: GameState): Entity => {
  if (!state.player) {
    throw new Error("Player state is not initialized");
  }
  return state.player.player;
};

export const getPlayerPosition = (state: GameState): number => {
  if (!state.player) {
    throw new Error("Player state is not initialized");
  }
  return state.player.position;
};
