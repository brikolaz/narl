import type { GameState } from "../../../state/state";
import { Direction } from "../../turn/types";
import type { KeyboardToAction } from "./chain";
import { getDropCommand } from "./commands/dropCommand";
import { getEquipCommand } from "./commands/equipCommand";
import { getInspectCommand } from "./commands/inspectCommand";
import { getMoveCommand } from "./commands/moveCommand";
import { getMoveItemCommand } from "./commands/moveItemCommand";
import { getPickUpCommand } from "./commands/pickupCommand";
import { getUnequipCommand } from "./commands/unequipCommand";

export const createKeyboardToAction = (
  gameState: GameState,
): KeyboardToAction => ({
  ArrowLeft: getMoveCommand(Direction.LEFT),
  ArrowRight: getMoveCommand(Direction.RIGHT),

  g: getPickUpCommand(),

  i: getInspectCommand(gameState),
  e: getEquipCommand(gameState),
  u: getUnequipCommand(gameState),
  m: getMoveItemCommand(gameState),
  d: getDropCommand(gameState),
});
