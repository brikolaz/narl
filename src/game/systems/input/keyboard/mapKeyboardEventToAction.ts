import type { RefObject } from "react";
import {
  getPlayerEntity,
  getPlayerPosition,
} from "../../../state/selectors/player";
import type { GameState } from "../../../state/state";
import type { GameAction } from "../../actions/types";
import { getEqSlots } from "../../eq/eq";
import { InternalActionType } from "../../internal/type";
import {
  getBackpack,
  getContainerItemAt,
  getContainerSize,
} from "../../inv/containers";
import type { InvSlot } from "../../inv/types";
import {
  PlayerActionType,
  PlayerDropItemActionReason,
  type PlayerAction,
} from "../../player/types";
import { Direction } from "../../turn/types";

const INV_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

const isInvKey = (key: string): key is `${InvSlot}` => {
  return INV_KEYS.includes(key as any);
};

const keyToInvSlot = (key: string): InvSlot => {
  return Number(key) as InvSlot;
};

export const mapKeyboardEventToAction = (
  event: KeyboardEvent,
  buffer: RefObject<string[]>,
  gameState: GameState,
): GameAction | undefined => {
  if (buffer.current.length) {
    if (event.key === "Escape") {
      buffer.current = [];
      return {
        type: InternalActionType.LOG,
        message: "Action canceled",
      };
    }
    if (buffer.current[0] === "e") {
      if (!isInvKey(event.key)) {
        return {
          type: InternalActionType.LOG,
          message: "Equip action in progress",
        };
      }

      buffer.current = [];
      return {
        type: PlayerActionType.EQUIP_ITEM,
        invSlot: keyToInvSlot(event.key),
        eqSlot: 1, // hardcoded for now
      };
    }
    if (buffer.current[0] === "u") {
      if (!isInvKey(event.key)) {
        return {
          type: InternalActionType.LOG,
          message: "Unequip action in progress",
        };
      }

      buffer.current = [];
      return {
        type: PlayerActionType.UNEQUIP_ITEM,
        eqSlot: 1, // hardcoded for now
      };
    }
    if (buffer.current[0] === "d") {
      if (!isInvKey(event.key)) {
        return {
          type: InternalActionType.LOG,
          message: "Drop action in progress",
        };
      }

      buffer.current = [];
      const backpack = getBackpack(getPlayerEntity(gameState));
      if (!backpack) {
        throw new Error("No Backpack");
      }
      const item = getContainerItemAt(backpack, keyToInvSlot(event.key));

      return {
        type: PlayerActionType.DROP_ITEM,
        itemId: item?.id,
        targetPosition: getPlayerPosition(gameState),
        reason: PlayerDropItemActionReason.MANUAL,
        eqSlot: undefined,
      };
    }
    if (buffer.current[0] === "m") {
      const backpack = getBackpack(getPlayerEntity(gameState));
      if (!backpack) {
        throw new Error("No Backpack");
      }
      const backpackSize = backpack ? getContainerSize(backpack) : undefined;
      if (buffer.current[1] === undefined) {
        if (!isInvKey(event.key)) {
          return {
            type: InternalActionType.LOG,
            message: "Move action in progress",
          };
        }

        buffer.current.push(event.key);
        return {
          type: InternalActionType.LOG,
          message: `Select target slot (1-${backpackSize})`,
        };
      }

      if (!isInvKey(event.key)) {
        return {
          type: InternalActionType.LOG,
          message: "Move action in progress",
        };
      }

      const gameAction: PlayerAction = {
        type: PlayerActionType.MOVE_ITEM,
        fromSlot: keyToInvSlot(buffer.current[1]),
        toSlot: keyToInvSlot(event.key),
      };
      buffer.current = [];

      return gameAction;
    }
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      return { type: PlayerActionType.MOVE, direction: Direction.LEFT };
    case "ArrowRight":
      return { type: PlayerActionType.MOVE, direction: Direction.RIGHT };
    case "g":
      return { type: PlayerActionType.PICK_UP_UNPACK };
    case "e":
    case "E": {
      buffer.current.push("e");
      const backpack = getBackpack(getPlayerEntity(gameState));
      const backpackSize = backpack ? getContainerSize(backpack) : undefined;
      return {
        type: InternalActionType.LOG,
        message: `Select item to equip (1-${backpackSize})`,
      };
    }
    case "u":
    case "U": {
      const eqSlots = getEqSlots(getPlayerEntity(gameState)).length;
      buffer.current.push("u");
      return {
        type: InternalActionType.LOG,
        message: `Select item to unequip (1-${eqSlots})`,
      };
    }
    case "d":
    case "D": {
      buffer.current.push("d");
      const backpack = getBackpack(getPlayerEntity(gameState));
      const backpackSize = backpack ? getContainerSize(backpack) : undefined;
      return {
        type: InternalActionType.LOG,
        message: `Select item to drop (1-${backpackSize})`,
      };
    }
    case "m":
    case "M": {
      buffer.current.push("m");
      const backpack = getBackpack(getPlayerEntity(gameState));
      const backpackSize = backpack ? getContainerSize(backpack) : undefined;
      return {
        type: InternalActionType.LOG,
        message: `Select item to move (1-${backpackSize})`,
      };
    }
    default:
      return undefined;
  }
};
