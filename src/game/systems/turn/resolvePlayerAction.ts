import type { GameState } from "../../state/state";
import {
  prepareAttack,
  resolveAttackAction,
} from "../combat/resolveAttackAction";
import { resolveEquipAction } from "../eq/resolveEquipAction";
import { resolveUnequipAction } from "../eq/resolveUnequipAction";
import { addLogImmutable } from "../log";
import { resolveMoveAction } from "../movement";
import { resolvePickUpAction } from "../pickUp/resolvePickUpAction";
import { resolvePickUpUnpack } from "../pickUp/resolvePickUpUnpack";
import { increaseTurn } from "./turn";
import {
  PlayerActionType,
  type ActionResolution,
  type PlayerAction,
} from "./types";

export const resolvePlayerAction = (
  state: GameState,
  action: PlayerAction,
): ActionResolution => {
  switch (action.type) {
    case PlayerActionType.MOVE: {
      const actionResolution = resolveMoveAction(state, action.direction);
      let nextState = actionResolution.nextState;

      if (actionResolution.consumesTurn) {
        nextState = increaseTurn(nextState);
      }

      return {
        ...actionResolution,
        nextState: actionResolution.action?.flushLogs(nextState) ?? nextState,
      };
    }
    case PlayerActionType.PICK_UP: {
      const actionResolution = resolvePickUpAction(state);
      let nextState = actionResolution.nextState;
      if (actionResolution.consumesTurn) {
        nextState = increaseTurn(nextState);
      }
      return {
        ...actionResolution,
        nextState: actionResolution.action?.flushLogs(nextState) ?? nextState,
      };
    }
    case PlayerActionType.PICK_UP_UNPACK: {
      const actionResolution = resolvePickUpUnpack(state);
      let nextState = actionResolution.nextState;
      if (actionResolution.consumesTurn) {
        nextState = increaseTurn(nextState);
      }
      return {
        ...actionResolution,
        nextState: actionResolution.action?.flushLogs(nextState) ?? nextState,
      };
    }
    case PlayerActionType.EQUIP_ITEM: {
      const actionResolution = resolveEquipAction(
        state,
        action.invSlot,
        action.eqSlot,
      );
      let nextState = actionResolution.nextState;

      if (actionResolution.consumesTurn) {
        nextState = increaseTurn(nextState);
      }
      return {
        ...actionResolution,
        nextState: actionResolution.action?.flushLogs(nextState) ?? nextState,
      };
    }
    case PlayerActionType.UNEQUIP_ITEM: {
      const actionResolution = resolveUnequipAction(state, action.eqSlot);
      let nextState = actionResolution.nextState;

      if (actionResolution.consumesTurn) {
        nextState = increaseTurn(nextState);
      }
      return {
        ...actionResolution,
        nextState: actionResolution.action?.flushLogs(nextState) ?? nextState,
      };
    }
    case PlayerActionType.ATTACK: {
      const ctx = prepareAttack(state, action.targetPosition);
      if (!ctx.ok) {
        return {
          nextState: addLogImmutable(state, ctx.message),
          consumesTurn: false,
          pendingActions: [],
        };
      }
      const actionResolution = resolveAttackAction(increaseTurn(state), ctx);
      return {
        ...actionResolution,
        nextState:
          actionResolution.action?.flushLogs(actionResolution.nextState) ??
          actionResolution.nextState,
      };
    }
    default:
      return {
        nextState: state,
        consumesTurn: false,
        pendingActions: [],
      };
  }
};
