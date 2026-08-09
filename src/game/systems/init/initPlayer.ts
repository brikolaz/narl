import { patchComponentByType } from "../../../core/model/queries/components/patch";
import { removeEntity } from "../../../core/model/queries/entities/remove";
import { INITIAL_PLAYER_POSITION } from "../../../utils/constants";
import { PositionComponent } from "../../model/components/PositionComponent";
import { PlayerEntityFactory } from "../../model/entities/PlayerEntity";
import { STATE, type PlayerState } from "../../state/state";

export const initPlayer = (): PlayerState => {
  removeEntity(STATE.player.player);
  const player = PlayerEntityFactory.getDefault();
  patchComponentByType(
    player,
    PositionComponent,
    (component) => (component.position = INITIAL_PLAYER_POSITION),
  );
  return {
    player,
    position: INITIAL_PLAYER_POSITION,
  };
};
