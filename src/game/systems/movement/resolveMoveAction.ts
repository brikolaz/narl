import { hasMobs } from "../../model/queries/mobs";
import { getPlayerEntity, getPlayerPosition } from "../../model/queries/player";
import { getTile } from "../../model/queries/tile";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { addExplorationExp } from "../exp/exp";
import { PlayerActionType, type PlayerMoveAction } from "../player/types";
import { discoverTiles } from "../world/tile";
import { markAsVisited } from "./exploration";
import { getNextPlayerPosition } from "./getNextPlayerPosition";

const getNextState = (state: GameState, nextPlayerPosition: number): void => {
  const world = state.world;
  const player = getPlayerEntity(state);
  state.player = {
    player: addExplorationExp(world[nextPlayerPosition].floor, player),
    position: nextPlayerPosition,
  };
  markAsVisited(state, nextPlayerPosition);
};

export const resolveMoveAction = (
  state: GameState,
  gameAction: PlayerMoveAction,
): ActionResolution => {
  const { direction } = gameAction;
  const action = new Action(gameAction);
  (() => {
    const currentPlayerPosition = getPlayerPosition(state);
    const nextPlayerPosition = getNextPlayerPosition({
      currentPosition: currentPlayerPosition,
      direction,
    });

    if (nextPlayerPosition === null) {
      return action.fail(`Cannot move ${direction.toLowerCase()}`);
    }
    discoverTiles(state, nextPlayerPosition);
    const nextTile = getTile(state, nextPlayerPosition);
    if (hasMobs(nextTile)) {
      return action.addPending({
        type: PlayerActionType.ATTACK,
        targetPosition: nextPlayerPosition,
      });
    }

    getNextState(state, nextPlayerPosition);
    action.success(`Moved ${direction.toLowerCase()}`);
  })();

  return action.resolve(state);
};
