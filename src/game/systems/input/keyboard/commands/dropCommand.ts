import {
  getPlayerEntity,
  getPlayerPosition,
} from "../../../../model/queries/player";
import type { GameState } from "../../../../state/state";
import { getBackpack, getContainerSize } from "../../../../model/queries/containers";
import type { InvSlot } from "../../../inv/types";
import {
  PlayerActionType,
  PlayerDropItemActionReason,
} from "../../../player/types";
import type { KeyboardToActionCommand } from "../chain";
import { createSlotActionCommands } from "./slots";

const getDropActionCommands = (gameState: GameState) => {
  const player = getPlayerEntity(gameState);
  const backpack = getBackpack(player);
  if (!backpack) {
    throw new Error("No player backpack");
  }
  const backpackSize = getContainerSize(backpack);

  return createSlotActionCommands<InvSlot>(
    backpackSize,
    (invSlot) => ({
      type: PlayerActionType.DROP_ITEM,
      invSlot,
      eqSlot: undefined,
      targetPosition: getPlayerPosition(gameState),
      reason: PlayerDropItemActionReason.MANUAL,
    }),
  );
};

export const getDropCommand = (
  gameState: GameState,
): KeyboardToActionCommand => {
  const player = getPlayerEntity(gameState);
  const backpack = getBackpack(player);
  if (!backpack) {
    throw new Error("No player backpack");
  }
  const backpackSize = getContainerSize(backpack);

  return {
    next: () => getDropActionCommands(gameState),
    message: `Select INV item to drop (1-${backpackSize})`,
    fallback: "Invalid item",
  };
};
