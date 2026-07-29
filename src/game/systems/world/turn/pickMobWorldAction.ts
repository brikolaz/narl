import type { Entity } from "../../../../core/model/Entity";
import type { Tile } from "../../../state/state";
import type { WorldAction } from "../types";
import { createWorldAttackAction } from "./actionCreators/createWorldAttackAction";

const actionCreators = [createWorldAttackAction];

// TODO: in future, add movement, pick up, throw etc.
export const pickMobWorldAction = (
  mob: Entity,
  tile: Tile,
): WorldAction | undefined => {
  for (const creator of actionCreators) {
    const action = creator(mob, tile);
    if (action) {
      return action;
    }
  }

  return undefined;
};
