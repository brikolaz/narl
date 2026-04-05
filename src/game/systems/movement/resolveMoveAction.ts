import type { GameState, Tile, WorldState } from "../../state/state";
import { fulfillAction, rejectAction } from "../log/action";
import type { ActionResolution, Direction } from "../turn";
import { getNextPlayerPosition } from "./getNextPlayerPosition";

const getNextState = (
  state: GameState,
  currentPlayerPosition: number,
  nextPlayerPosition: number,
): GameState => {
  const nextWorld: WorldState = [...state.world];
  const player = nextWorld[currentPlayerPosition].player;
  const oldPlayerTile: Tile = {
    floor: nextWorld[currentPlayerPosition].floor,
    items: nextWorld[currentPlayerPosition].items,
    player: undefined,
  };
  const newPlayerTile: Tile = {
    floor: nextWorld[nextPlayerPosition].floor,
    items: nextWorld[nextPlayerPosition].items,
    player: player,
  };
  nextWorld[currentPlayerPosition] = oldPlayerTile;
  nextWorld[nextPlayerPosition] = newPlayerTile;

  return { ...state, world: nextWorld };
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
