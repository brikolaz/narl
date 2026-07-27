import { getBackpack } from "../../../model/queries/containers";
import { getEq } from "../../../model/queries/eq";
import { getPlayerEntity } from "../../../model/queries/player";
import type { EqSlot } from "../../../eq/types";
import { PlayerActionType } from "../../../systems/player/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";
import { createSlotActionCommands } from "./slots";

const getTargetSlotCommand = (): KeyboardToAction => {
  const player = getPlayerEntity();
  const eqSize = getEq(player)?.length;

  return createSlotActionCommands<EqSlot>(eqSize, (slot) => ({
    type: PlayerActionType.UNEQUIP_ITEM,
    eqSlot: slot,
  }));
};

export const getUnequipCommand = (): KeyboardToActionCommand => {
  const player = getPlayerEntity();
  const backpack = getBackpack(player);
  if (!backpack) {
    throw new Error("No player backpack");
  }
  const eqSize = getEq(player)?.length;

  return {
    next: () => getTargetSlotCommand(),
    message: `Select EQ slot to unequip (1-${eqSize})`,
    fallback: "Invalid slot",
  };
};
