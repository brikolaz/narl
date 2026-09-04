import { getManual } from "../../model/entities/getManual";
import { getMob, hasMobs } from "../../model/queries/mobs";
import { getPlayer } from "../../model/queries/player";
import { getPosition } from "../../model/queries/position";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import { getNextPosition } from "../movement/position";
import type { PlayerPokeAction } from "../player/types";

export const resolvePokeAction = (
  gameAction: PlayerPokeAction,
): ActionResolution => {
  const { direction } = gameAction;
  const action = new Action(gameAction);
  (() => {
    const targetPosition = getNextPosition({
      currentPosition: getPosition(getPlayer()),
      direction
    })
    if (
      targetPosition === null
    ) {
      return action.fail("Nothing to poke");
    }

    const target = getTile(targetPosition);
    if (!hasMobs(target)) {
      return action.fail("Nothing to poke");
    }
    const mob = getMob(target);
    if (!mob) {
      return action.fail("Nothing to poke");
    }

    if (getManual(mob)?.poke) {
      getManual(mob)?.poke?.(action, mob);
      return;
    }
    return action.success(`Poked ${getEntityName(mob)}`);
  })();

  return action.resolve();
};
