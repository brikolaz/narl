import { removeEntity } from "../../../core/ecs/queries/entities/remove";
import { INITIAL_PLAYER_POSITION } from "../../../utils/constants";
import { PlayerEntityFactory } from "../../model/entities/PlayerEntity";
import { STATE, type PlayerState } from "../../state/state";

export const initPlayer = (): PlayerState => {
  removeEntity(STATE.player.player);
  return {
    player: PlayerEntityFactory.getDefault(),
    position: INITIAL_PLAYER_POSITION,
  };
};
