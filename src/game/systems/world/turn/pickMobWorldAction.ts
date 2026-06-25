import type { Entity } from "../../../../core/ecs/Entity";
import type { GameState, Tile } from "../../../state/state";
import type { WorldAction } from "../types";
import { createWorldAttackAction } from "./actionCreators/createWorldAttackAction";

const actionCreators = [createWorldAttackAction];

// TODO: in future, add movement, pick up, throw etc.
export const pickMobWorldAction = (
  mob: Entity,
  tile: Tile,
  gameState: GameState,
): WorldAction | undefined => {
  for (const creator of actionCreators) {
    const action = creator(mob, tile, gameState);
    if (action) {
      return action;
    }
  }

  return undefined;
};
