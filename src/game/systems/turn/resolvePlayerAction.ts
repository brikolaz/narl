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
import { increaseTurn } from "./turn";
import {
  GameActionType,
  type ActionResolution,
  type GameAction,
} from "./types";

export const resolvePlayerAction = (
  state: GameState,
  action: GameAction,
): ActionResolution<GameState> => {
  switch (action.type) {
    case GameActionType.MOVE: {
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
    case GameActionType.PICK_UP: {
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
    case GameActionType.EQUIP_ITEM: {
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
    case GameActionType.UNEQUIP_ITEM: {
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
    case GameActionType.ATTACK: {
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
