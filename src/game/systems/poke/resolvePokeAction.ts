import { getManual } from "../../model/entities/getManual";
import { getMob, hasMobs } from "../../model/queries/mobs";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import type { PlayerPokeAction } from "../player/types";
import {
  MAX_WORLD_POSITION,
  MIN_WORLD_POSITION,
} from "../../../utils/constants";

export const resolvePokeAction = (
  gameAction: PlayerPokeAction,
): ActionResolution => {
  const { targetPosition } = gameAction;
  const action = new Action(gameAction);
  (() => {
    if (
      targetPosition < MIN_WORLD_POSITION ||
      targetPosition > MAX_WORLD_POSITION
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
