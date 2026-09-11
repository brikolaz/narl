import { getEntityById } from "../../../core/model/queries/entities/get";
import { getManual } from "../../model/entities/getManual";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import { getMob } from "../mobs/mobs";
import { getNextPosition } from "../movement/position";
import { getPlayer } from "../player/player";
import { getPosition } from "../position/position";
import type { WorldPokeAction } from "../world/types";
import { getTile } from "../world/tile";
import { getInspectDesc, increaseInspected } from "../inspect/inspect";

export const resolveWorldPokeAction = (
  gameAction: WorldPokeAction,
): ActionResolution => {
  const action = new Action(gameAction);
  const { sourceId, direction } = gameAction;

  (() => {
    const source = getEntityById(sourceId);
    if (!source) {
      return action.fail("Nothing to poke");
    }

    const targetPosition = getNextPosition({
      currentPosition: getPosition(source),
      direction,
    });
    if (targetPosition === null) {
      return action.fail("Nothing to poke");
    }

    const player = getPlayer();
    const target =
      source.id !== player.id && getPosition(player) === targetPosition
        ? player
        : getMob(getTile(targetPosition));
    if (!target) {
      return action.fail("Nothing to poke");
    }

    action.success(
      [`${getEntityName(source)} poked ${getEntityName(target)}`, getInspectDesc(target)].join('. '),
    );
    increaseInspected(target);
    getManual(target)?.afterPoke?.(action, source, target)
  })();

  return action.resolve();
};
