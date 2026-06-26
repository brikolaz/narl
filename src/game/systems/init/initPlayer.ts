import { INITIAL_PLAYER_POSITION } from "../../../utils/constants";
import {
    PlayerEntityFactory
} from "../../model/entities/PlayerEntity";
import type { PlayerState } from "../../state/state";

export const initPlayer = (): PlayerState => {
  return {
    player: PlayerEntityFactory.getDefault(),
    position: INITIAL_PLAYER_POSITION,
  };
};
