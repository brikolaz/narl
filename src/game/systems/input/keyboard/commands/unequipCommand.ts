import { getBackpack } from "../../../../model/queries/containers";
import { getEq } from "../../../../model/queries/eq";
import { getPlayerEntity } from "../../../../model/queries/player";
import type { GameState } from "../../../../state/state";
import type { EqSlot } from "../../../eq/types";
import { PlayerActionType } from "../../../player/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";
import { createSlotActionCommands } from "./slots";

const getTargetSlotCommand = (gameState: GameState): KeyboardToAction => {
  const player = getPlayerEntity(gameState);
  const eqSize = getEq(player)?.length;

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
  const eqSize = getEq(player)?.length;

  return {
    next: () => getTargetSlotCommand(gameState),
    message: `Select EQ slot to unequip (1-${eqSize})`,
    fallback: "Invalid slot",
  };
};
