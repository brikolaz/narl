// game/systems/input/mapKeyboardEventToAction.ts
import type { RefObject } from "react";
import { getPlayer, getPlayerPosition, type GameState } from "../../../state";
import { getEqSlots } from "../../eq";
import { getBackpack, getBackpackItem, getContainerSize } from "../../inv";
import { addLogImmutable } from "../../log";
import {
  Direction,
  PlayerActionType,
  WorldActionEntityType,
  WorldActionType,
  type GameAction,
  type InvSlot,
  type PlayerAction,
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
    if (buffer.current[0] === "d") {
      if (!["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)) {
        setGameState(addLogImmutable(gameState, "Drop action in progress"));
        return;
      }

      buffer.current = [];
      const backpack = getBackpack(getPlayer(gameState));
      if (!backpack) {
        throw new Error("No Backpack");
      }
      const item = getBackpackItem(backpack, Number(event.key) as InvSlot);

      return {
        type: WorldActionType.DROP_ITEM,
        entityType: WorldActionEntityType.PLAYER,
        itemId: item?.id,
        targetPosition: getPlayerPosition(gameState),
        entityId: undefined,
      };
    }
    if (buffer.current[0] === "m") {
      const backpack = getBackpack(getPlayer(gameState));
      if (!backpack) {
        throw new Error("No Backpack");
      }
      const backpackSize = backpack ? getContainerSize(backpack) : undefined;
      if (buffer.current[1] === undefined) {
        if (
          !["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)
        ) {
          setGameState(addLogImmutable(gameState, "Move action in progress"));
          return;
        }

        buffer.current.push(event.key);
        setGameState(
          addLogImmutable(
            gameState,
            `Select target container (1-${backpackSize})`,
          ),
        );
        return;
      }

      if (!["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)) {
        setGameState(addLogImmutable(gameState, "Move action in progress"));
        return;
      }

      const gameAction: PlayerAction = {
        type: PlayerActionType.MOVE_ITEM,
        fromSlot: Number(buffer.current[1]) as InvSlot,
        toSlot: Number(event.key) as InvSlot,
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
      const backpack = getBackpack(getPlayer(gameState));
      const backpackSize = backpack ? getContainerSize(backpack) : undefined;
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
    case "d":
    case "D": {
      buffer.current.push("d");
      const backpack = getBackpack(getPlayer(gameState));
      const backpackSize = backpack ? getContainerSize(backpack) : undefined;
      setGameState(
        addLogImmutable(gameState, `Select item to drop (1-${backpackSize})`),
      );
      return;
    }
    case "m":
    case "M": {
      buffer.current.push("m");
      const backpack = getBackpack(getPlayer(gameState));
      const backpackSize = backpack ? getContainerSize(backpack) : undefined;
      setGameState(
        addLogImmutable(gameState, `Select item to move (1-${backpackSize})`),
      );
      return;
    }
    default:
      return undefined;
  }
};
