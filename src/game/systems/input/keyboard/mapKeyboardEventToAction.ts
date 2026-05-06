// game/systems/input/mapKeyboardEventToAction.ts
import type { RefObject } from "react";
import { getComponentByType } from "../../../../core/ecs";
import { SizeComponent } from "../../../model";
import { getPlayer, type GameState } from "../../../state";
import { getEqSlots } from "../../eq";
import { getBackpack } from "../../inv";
import { addLogImmutable } from "../../log";
import {
  Direction,
  PlayerActionType,
  type GameAction,
  type InvSlot,
} from "../../turn";

export const clearBuffer = (buffer: RefObject<string[]>): void => {
  if (buffer.current[0] === "Shift") {
    buffer.current = [];
  }
};
export const mapKeyboardEventToAction = (
  event: KeyboardEvent,
  buffer: RefObject<string[]>,
  gameState: GameState,
  setGameState: (gameState: GameState) => void,
): GameAction | undefined => {
  if (buffer.current.length) {
    if (event.key === "Escape") {
      buffer.current = [];
    }
    if (buffer.current[0] === "e") {
      if (!["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)) {
        setGameState(addLogImmutable(gameState, "Equip action in progress"));
        return;
      }

      buffer.current = [];
      return {
        type: PlayerActionType.EQUIP_ITEM,
        invSlot: Number(event.key) as InvSlot,
        eqSlot: 1, // hardcoded for now
      };
    }
    if (buffer.current[0] === "u") {
      if (!["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)) {
        setGameState(addLogImmutable(gameState, "Unequip action in progress"));
        return;
      }

      buffer.current = [];
      return {
        type: PlayerActionType.UNEQUIP_ITEM,
        eqSlot: 1, // hardcoded for now
      };
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
      const backpack = getBackpack(getPlayer(gameState));
      const backpackSize = getComponentByType(backpack, SizeComponent)?.size;
      setGameState(
        addLogImmutable(gameState, `Select item to equip (1-${backpackSize})`),
      );
      return;
    }
    case "u":
    case "U": {
      const eqSlots = getEqSlots(getPlayer(gameState)).length;
      buffer.current.push("u");
      setGameState(
        addLogImmutable(gameState, `Select item to unequip (1-${eqSlots})`),
      );
      return;
    }
    default:
      return undefined;
  }
};
