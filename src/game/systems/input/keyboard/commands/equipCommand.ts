import { getBackpack, getContainerSize } from "../../../../model/queries/containers";
import { getEq } from "../../../../model/queries/eq";
import { getPlayerEntity } from "../../../../model/queries/player";
import type { GameState } from "../../../../state/state";
import type { EqSlot } from "../../../eq/types";
import type { InvSlot } from "../../../containers/types";
import { PlayerActionType } from "../../../player/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";
import { createSlotActionCommands, createSlotNextCommands } from "./slots";

const getEquipActionSlotCommand = (
  eqSize: number | undefined,
  invSlot: InvSlot,
): KeyboardToAction => {
  return createSlotActionCommands<EqSlot>(eqSize, (eqSlot) => ({
    type: PlayerActionType.EQUIP_ITEM,
    invSlot,
    eqSlot,
  }));
};

const getEquipNextSlotCommand = (
  gameState: GameState,
  backpackSize: number | undefined,
): KeyboardToAction => {
  const player = getPlayerEntity(gameState);
  const eqSize = getEq(player)?.length;

  return createSlotNextCommands<InvSlot>(
    backpackSize,
    (invSlot) => {
      return getEquipActionSlotCommand(eqSize, invSlot);
    },
    `Select target EQ slot (1-${eqSize})`,
    "Invalid slot",
  );
};

export const getEquipCommand = (
  gameState: GameState,
): KeyboardToActionCommand => {
  const player = getPlayerEntity(gameState);
  const backpack = getBackpack(player);
  if (!backpack) {
    throw new Error("No player backpack");
  }
  const backpackSize = getContainerSize(backpack);

  return {
    next: () => {
      return getEquipNextSlotCommand(gameState, backpackSize);
    },
    message: `Select INV item to equip (1-${backpackSize})`,
    fallback: "Invalid item",
  };
};
