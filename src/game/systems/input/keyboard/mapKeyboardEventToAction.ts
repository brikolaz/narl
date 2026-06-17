import type { RefObject } from "react";
import {
  getPlayerEntity,
  getPlayerPosition,
} from "../../../state/selectors/player";
import type { GameState } from "../../../state/state";
import type { GameAction } from "../../actions/types";
import { getEqSlots } from "../../eq/eq";
import type { EqSlot } from "../../eq/types";
import { InternalActionType } from "../../internal/type";
import {
  getBackpack,
  getContainerSize
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

const EQ_KEYS = ["1"] as const;

const isEqKey = (key: string): key is `${EqSlot}` => {
  return EQ_KEYS.includes(key as any);
};

const keyToEqSlot = (key: string): EqSlot => {
  return Number(key) as EqSlot;
};

enum InspectType {
  INV = "1",
  EQ = "2",
}

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
    if (buffer.current[0] === "i") {
      if (!buffer.current[1]) {
        if (event.key === InspectType.INV) {
          buffer.current.push(event.key as InspectType);
          const backpack = getBackpack(getPlayerEntity(gameState));
          const backpackSize = backpack
            ? getContainerSize(backpack)
            : undefined;
          return {
            type: InternalActionType.LOG,
            message: `Select INV item to inspect (1-${backpackSize})`,
          };
        }
        if (event.key === InspectType.EQ) {
          buffer.current.push(event.key as InspectType);
          const eqSlots = getEqSlots(getPlayerEntity(gameState)).length;
          return {
            type: InternalActionType.LOG,
            message: `Select EQ item to inspect (1-${eqSlots})`,
          };
        }
      }
      if (buffer.current[1] === InspectType.INV) {
        if (isInvKey(event.key)) {
          buffer.current = [];
          return {
            type: PlayerActionType.INSPECT_INV,
            invSlot: keyToInvSlot(event.key),
          };
        }
      }
      if (buffer.current[1] === InspectType.EQ) {
        if (isEqKey(event.key)) {
          buffer.current = [];
          return {
            type: PlayerActionType.INSPECT_EQ,
            eqSlot: keyToEqSlot(event.key),
          };
        }
      }
      return {
        type: InternalActionType.LOG,
        message: "Inspect action in progress",
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
      return {
        type: PlayerActionType.DROP_ITEM,
        invSlot: keyToInvSlot(event.key),
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
    case "i":
    case "I": {
      buffer.current.push("i");
      return {
        type: InternalActionType.LOG,
        message: `Press 1 to inspect INV, 2 to inspect EQ`,
      };
    }
    default:
      return undefined;
  }
};
