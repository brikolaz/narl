import { upsertComponent } from "../../../core/ecs/queries/component";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import type { GameState, Tile } from "../../state/state";
import { addExplorationExp } from "../exp";
import { fulfillAction, rejectAction } from "../log";
import type { ActionResolution, Direction } from "../turn";
import { getNextPlayerPosition } from "./getNextPlayerPosition";

const markAsVisited = (state: GameState, position: number): GameState => {
  const nextState = { ...state, world: [...state.world] };

  nextState.world[position].floor = upsertComponent(
    nextState.world[position].floor,
    new VisitedComponent(),
  );

  return nextState;
};

const getNextState = (
  state: GameState,
  currentPlayerPosition: number,
  nextPlayerPosition: number,
): GameState => {
  let nextState: GameState = { ...state, world: [...state.world] };
  const nextWorld = nextState.world;
  const player = nextWorld[currentPlayerPosition].player;
  const oldPlayerTile: Tile = {
    floor: nextWorld[currentPlayerPosition].floor,
    items: nextWorld[currentPlayerPosition].items,
    player: undefined,
  };
  const newPlayerTile: Tile = {
    floor: nextWorld[nextPlayerPosition].floor,
    items: nextWorld[nextPlayerPosition].items,
    player: addExplorationExp(nextWorld[nextPlayerPosition].floor, player),
  };
  nextWorld[currentPlayerPosition] = oldPlayerTile;
  nextWorld[nextPlayerPosition] = newPlayerTile;
  nextState = markAsVisited(nextState, nextPlayerPosition);

  return nextState;
};

export function resolveMoveAction(
  state: GameState,
  direction: Direction,
): ActionResolution<GameState> {
  const currentPlayerPosition = state.world.findIndex((tile) => tile.player); // TODO: getPlayerPosition util
  const nextPlayerPosition = getNextPlayerPosition({
    currentPosition: currentPlayerPosition,
    direction,
  });

  if (nextPlayerPosition === null) {
    return rejectAction(state, "Cannot move in that direction.", false);
  }

  const nextState = getNextState(
    state,
    currentPlayerPosition,
    nextPlayerPosition,
  );

  return fulfillAction(nextState, "Player moved.", true);
}
