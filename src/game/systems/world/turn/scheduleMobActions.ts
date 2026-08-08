import { STATE } from "../../../state/state";
import type { GameAction } from "../../actions/types";
import { WorldActionType } from "../types";

export const enqueueMobActions = () => {
  const nextQueue: GameAction[] = [];
  const tiles = STATE.world;

  const mobs = tiles.flatMap((tile) => tile.mobs);

  for (const mob of mobs) {
    nextQueue.push({
      type: WorldActionType.MOB_AI,
      mobId: mob.id,
    });
  }

  return nextQueue;
};
