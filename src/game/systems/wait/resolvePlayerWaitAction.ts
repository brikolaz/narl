import { getEqItems, getEqItemSlot } from "../../model/queries/eq";
import { getPlayer } from "../../model/queries/player";
import { getPosition } from "../../model/queries/position";
import { STATE } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { EqSlot } from "../eq/eq";
import { getEntityName } from "../inspect/getEntityName";
import {
  PlayerActionType,
  PlayerInspectActionReason,
  type PlayerWaitAction,
} from "../player/types";
import { getRng } from "../rng/rng";
import { WorldActionType } from "../world/types";

const isPlayerBored = () => {
  const lastActions = STATE.actionLog.slice(-5);
  return (
    lastActions.length === 5 &&
    lastActions.every(
      (lastAction) => lastAction.action.type === PlayerActionType.WAIT,
    )
  );
};

export const resolvePlayerWaitAction = (
  gameAction: PlayerWaitAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    const player = getPlayer();
    const rng = getRng(player);

    action.addPendingImmediateAction({
      type: WorldActionType.HEAL,
      entityId: player.id,
      value: rng.range(4, 5),
    });

    if (!isPlayerBored()) {
      return action.success(`${getEntityName(getPlayer())} wait`);
    }

    const eqItems = getEqItems(player);
    if (eqItems.length) {
      const eqItem = eqItems[rng.range(0, eqItems.length - 1)];
      const eqSlot = getPosition(getEqItemSlot(eqItem));
      if (eqSlot) {
        action.addPendingImmediateAction({
          type: PlayerActionType.INSPECT_EQ,
          eqSlot: eqSlot as EqSlot,
          reason: PlayerInspectActionReason.BORED,
        });
      }
    } else {
      action.success(`${getEntityName(getPlayer())} are bored`);
    }
  })();

  return action.resolve(true);
};
