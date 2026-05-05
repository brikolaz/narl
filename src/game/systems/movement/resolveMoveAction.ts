import { produce } from "immer";
import { upsertComponent } from "../../../core/ecs/queries/component";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import type { GameState, Tile } from "../../state/state";
import { hasMobs } from "../combat";
import { addExplorationExp } from "../exp";
import { Action } from "../log";
import { GameActionType, type ActionResolution, type Direction } from "../turn";
import { getNextPlayerPosition } from "./getNextPlayerPosition";
import { getPlayerPosition } from "../../state";

const markAsVisited = (state: GameState, position: number): void => {
  upsertComponent(state.world[position].floor, new VisitedComponent());
};

const getNextState = (
  state: GameState,
  currentPlayerPosition: number,
  nextPlayerPosition: number,
): void => {
  const world = state.world;
  const player = world[currentPlayerPosition].player;
  const oldPlayerTile: Tile = {
    floor: world[currentPlayerPosition].floor,
    items: world[currentPlayerPosition].items,
    player: undefined,
    mobs: world[currentPlayerPosition].mobs,
  };
  const newPlayerTile: Tile = {
    floor: world[nextPlayerPosition].floor,
    items: world[nextPlayerPosition].items,
    player: addExplorationExp(world[nextPlayerPosition].floor, player),
    mobs: world[nextPlayerPosition].mobs,
  };
  world[currentPlayerPosition] = oldPlayerTile;
  world[nextPlayerPosition] = newPlayerTile;
  markAsVisited(state, nextPlayerPosition);
};

export const resolveMoveAction = (
  state: GameState,
  direction: Direction,
): ActionResolution<GameState> => {
  const action = new Action();
  const nextState = produce(state, (draft) => {
    const currentPlayerPosition = getPlayerPosition(draft);
    const nextPlayerPosition = getNextPlayerPosition({
      currentPosition: currentPlayerPosition,
      direction,
    });

    if (nextPlayerPosition === null) {
      return action.reject("Cannot move in that direction.");
    }
    if (hasMobs(draft.world[nextPlayerPosition])) {
      return action.addPending({
        type: GameActionType.ATTACK,
        targetPosition: nextPlayerPosition,
      });
    }

    getNextState(draft, currentPlayerPosition, nextPlayerPosition);
    action.fulfill("Player moved.");
  });

  return action.resolve(nextState);
};
