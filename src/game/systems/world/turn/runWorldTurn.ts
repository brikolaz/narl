import { removeComponentsByType } from "../../../../core/model/queries/components/remove";
import { UnawareComponent } from "../../../model/components/UnawareComponent";
import {
  drainAction,
  drainDequeuedAction,
  type DrainContext,
  type DrainedResolution,
} from "../../actions/gameAction/dispatchGameAction";
import { dequeueTimedActions } from "../../actions/timedActions/timedActions";
import type { GameAction } from "../../actions/types";
import { getVisibleTiles } from "../../player/getVisibleTiles";
import { enqueueMobActions } from "./scheduleMobActions";

const makeMobsAware = () => {
  const mobs = getVisibleTiles().flatMap((tile) => tile.mobs);
  for (const mob of mobs) {
    removeComponentsByType(mob, UnawareComponent);
  }
};

export const runWorldTurn = (context: DrainContext): DrainedResolution => {
  let consumesTurn = false;
  const queue: GameAction[] = enqueueMobActions();

  for (const worldAction of queue) {
    const worldResult = drainAction(worldAction, context);

    consumesTurn ||= worldResult.consumesTurn;
  }

  const dequeuedActions = dequeueTimedActions([...context.processedActions]);

  for (const timedAction of dequeuedActions) {
    const timedResult = drainDequeuedAction(timedAction, context);

    consumesTurn ||= timedResult.consumesTurn;
  }

  makeMobsAware();

  return { consumesTurn };
};
