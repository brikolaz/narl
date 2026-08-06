import { Direction } from "../../systems/turn/types";
import type { KeyboardToAction } from "./chain";
import { getDropCommand } from "./commands/dropCommand";
import { getEquipCommand } from "./commands/equipCommand";
import { getInspectCommand } from "./commands/inspectCommand";
import { getMoveCommand } from "./commands/moveCommand";
import { getMoveItemCommand } from "./commands/moveItemCommand";
import { getPickUpCommand } from "./commands/pickupCommand";
import { getPokeCommand } from "./commands/pokeCommand";
import { getUnequipCommand } from "./commands/unequipCommand";

export const createKeyboardToAction = ():
  | KeyboardToAction => ({
  ArrowLeft: getMoveCommand(Direction.LEFT),
  ArrowRight: getMoveCommand(Direction.RIGHT),
  KeyG: getPickUpCommand(),
  KeyI: getInspectCommand(),
  KeyE: getEquipCommand(),
  KeyU: getUnequipCommand(),
  KeyM: getMoveItemCommand(),
  KeyD: getDropCommand(),
  KeyP: getPokeCommand(),
});
