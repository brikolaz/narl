import { getPlayerEntity } from "../../../../state/selectors/player";
import type { GameState } from "../../../../state/state";
import { getBackpack, getContainerSize } from "../../../inv/containers";
import type { InvSlot } from "../../../inv/types";
import { PlayerActionType } from "../../../player/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";
import { createSlotActionCommands, createSlotNextCommands } from "./slots";

const getMoveItemActionCommand = (backpackSize: number, fromSlot: InvSlot) => {
  return createSlotActionCommands<InvSlot>(backpackSize, (toSlot) => ({
    type: PlayerActionType.MOVE_ITEM,
    fromSlot,
    toSlot,
  }));
};

const getMoveItemNextCommand = (backpackSize: number): KeyboardToAction => {
  return createSlotNextCommands<InvSlot>(
    backpackSize,
    (fromSlot) => {
      return getMoveItemActionCommand(backpackSize, fromSlot);
    },
    `Select target INV slot (1-${backpackSize})`,
    `Invalid item`,
  );
};

export const getMoveItemCommand = (
  gameState: GameState,
): KeyboardToActionCommand => {
  const player = getPlayerEntity(gameState);
  const backpack = getBackpack(player);
  if (!backpack) {
    throw new Error("No player backpack");
  }
  const backpackSize = getContainerSize(backpack);

  return {
    next: () => getMoveItemNextCommand(backpackSize),
    message: `Select source INV item (1-${backpackSize})`,
    fallback: "Invalid item",
  };
};
