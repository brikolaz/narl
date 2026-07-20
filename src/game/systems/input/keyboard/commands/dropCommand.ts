import {
  getPlayerEntity,
  getPlayerPosition,
} from "../../../../model/queries/player";
import { getBackpack, getContainerSize } from "../../../../model/queries/containers";
import type { InvSlot } from "../../../containers/types";
import {
  PlayerActionType,
  PlayerDropItemActionReason,
} from "../../../player/types";
import type { KeyboardToActionCommand } from "../chain";
import { createSlotActionCommands } from "./slots";

const getDropActionCommands = () => {
  const player = getPlayerEntity();
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
      targetPosition: getPlayerPosition(),
      reason: PlayerDropItemActionReason.MANUAL,
    }),
  );
};

export const getDropCommand = (): KeyboardToActionCommand => {
  const player = getPlayerEntity();
  const backpack = getBackpack(player);
  if (!backpack) {
    throw new Error("No player backpack");
  }
  const backpackSize = getContainerSize(backpack);

  return {
    next: () => getDropActionCommands(),
    message: `Select INV item to drop (1-${backpackSize})`,
    fallback: "Invalid item",
  };
};
