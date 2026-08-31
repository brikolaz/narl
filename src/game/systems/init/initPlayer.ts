import { PlayerEntityFactory } from "../../model/entities/PlayerEntity";
import { getPosition } from "../../model/queries/position";
import { type PlayerState } from "../../state/state";

export const initPlayer = (): PlayerState => {
  const player = PlayerEntityFactory.getDefault();
  return {
    player,
    position: getPosition(player)
  };
};
