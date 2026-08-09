import { patchComponentByType } from "../../../core/model/queries/components/patch";
import { PositionComponent } from "../../model/components/PositionComponent";
import { hasMobs } from "../../model/queries/mobs";
import { getPlayer } from "../../model/queries/player";
import { getPosition } from "../../model/queries/position";
import { getTile } from "../../model/queries/tile";
import { STATE } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { addExplorationExp } from "../exp/exp";
import { PlayerActionType, type PlayerMoveAction } from "../player/types";
import { discoverTiles } from "../world/tile";
import { markAsVisited } from "./exploration";
import { getNextPosition } from "./position";

const getNextState = (nextPlayerPosition: number): void => {
  const player = getPlayer();
  patchComponentByType(
    player,
    PositionComponent,
    (component) => (component.position = nextPlayerPosition),
  );
  STATE.player = {
    player: addExplorationExp(getTile(nextPlayerPosition).floor, player),
    position: nextPlayerPosition,
  };
  markAsVisited(nextPlayerPosition);
};

export const resolvePlayerMoveAction = (
  gameAction: PlayerMoveAction,
): ActionResolution => {
  const { direction } = gameAction;
  const action = new Action(gameAction);
  (() => {
    const currentPlayerPosition = getPosition(getPlayer());
    const nextPlayerPosition = getNextPosition({
      currentPosition: currentPlayerPosition,
      direction,
    });

    if (nextPlayerPosition === null) {
      return action.fail(`Cannot move ${direction.toLowerCase()}`);
    }
    discoverTiles(nextPlayerPosition);
    const nextTile = getTile(nextPlayerPosition);
    if (hasMobs(nextTile)) {
      return action.addPendingImmediateAction({
        type: PlayerActionType.ATTACK,
        targetPosition: nextPlayerPosition,
      });
    }

    getNextState(nextPlayerPosition);
    action.success(`Moved ${direction.toLowerCase()}`);
  })();

  return action.resolve();
};
