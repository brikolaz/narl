import { Direction } from "../../turn/types";
import type { KeyboardToAction } from "./chain";
import { getDropCommand } from "./commands/dropCommand";
import { getEquipCommand } from "./commands/equipCommand";
import { getInspectCommand } from "./commands/inspectCommand";
import { getMoveCommand } from "./commands/moveCommand";
import { getMoveItemCommand } from "./commands/moveItemCommand";
import { getPickUpCommand } from "./commands/pickupCommand";
import { getUnequipCommand } from "./commands/unequipCommand";

export const createKeyboardToAction = (): KeyboardToAction => ({
  ArrowLeft: getMoveCommand(Direction.LEFT),
  ArrowRight: getMoveCommand(Direction.RIGHT),

  g: getPickUpCommand(),
  G: getPickUpCommand(),

  i: getInspectCommand(),
  I: getInspectCommand(),

  e: getEquipCommand(),
  E: getEquipCommand(),

  u: getUnequipCommand(),
  U: getUnequipCommand(),

  m: getMoveItemCommand(),
  M: getMoveItemCommand(),

  d: getDropCommand(),
  D: getDropCommand(),
});
