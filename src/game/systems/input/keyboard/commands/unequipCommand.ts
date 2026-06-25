import { getPlayerEntity } from "../../../../model/queries/player";
import type { GameState } from "../../../../state/state";
import { getEqSlots } from "../../../../model/queries/eq";
import type { EqSlot } from "../../../eq/types";
import { getBackpack } from "../../../../model/queries/containers";
import { PlayerActionType } from "../../../player/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";
import { createSlotActionCommands } from "./slots";

const getTargetSlotCommand = (gameState: GameState): KeyboardToAction => {
  const player = getPlayerEntity(gameState);
  const eqSize = getEqSlots(player)?.length;

  return createSlotActionCommands<EqSlot>(eqSize, (slot) => ({
    type: PlayerActionType.UNEQUIP_ITEM,
    eqSlot: slot,
  }));
};

export const getUnequipCommand = (
  gameState: GameState,
): KeyboardToActionCommand => {
  const player = getPlayerEntity(gameState);
  const backpack = getBackpack(player);
  if (!backpack) {
    throw new Error("No player backpack");
  }
  const eqSize = getEqSlots(player)?.length;

  return {
    next: () => getTargetSlotCommand(gameState),
    message: `Select EQ slot to unequip (1-${eqSize})`,
    fallback: "Invalid slot",
  };
};
