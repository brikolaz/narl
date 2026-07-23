import { hasMobs } from "../../model/queries/mobs";
import { getPlayerEntity, getPlayerPosition } from "../../model/queries/player";
import { getTile } from "../../model/queries/tile";
import { STATE } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { addExplorationExp } from "../exp/exp";
import { PlayerActionType, type PlayerMoveAction } from "../player/types";
import { discoverTiles } from "../world/tile";
import { markAsVisited } from "./exploration";
import { getNextPlayerPosition } from "./getNextPlayerPosition";

const getNextState = (nextPlayerPosition: number): void => {
  const player = getPlayerEntity();
  STATE.player = {
    player: addExplorationExp(getTile(nextPlayerPosition).floor, player),
    position: nextPlayerPosition,
  };
  markAsVisited(nextPlayerPosition);
};

export const resolveMoveAction = (
  gameAction: PlayerMoveAction,
): ActionResolution => {
  const { direction } = gameAction;
  const action = new Action(gameAction);
  (() => {
    const currentPlayerPosition = getPlayerPosition();
    const nextPlayerPosition = getNextPlayerPosition({
      currentPosition: currentPlayerPosition,
      direction,
    });

    if (nextPlayerPosition === null) {
      return action.fail(`Cannot move ${direction.toLowerCase()}`);
    }
    discoverTiles(nextPlayerPosition);
    const nextTile = getTile(nextPlayerPosition);
    if (hasMobs(nextTile)) {
      return action.addPendingActions({
        type: PlayerActionType.ATTACK,
        targetPosition: nextPlayerPosition,
      });
    }

    getNextState(nextPlayerPosition);
    action.success(`Moved ${direction.toLowerCase()}`);
  })();

  return action.resolve();
};
