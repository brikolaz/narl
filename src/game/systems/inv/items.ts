import { getComponentByType } from "../../../core/ecs/queries/component";
import { CURSED_PREFIX } from "../../../utils";
import { NameComponent } from "../../model/components/display/NameComponent";
import type { ItemEntity } from "../../model/entities/items/ItemEntity";
import { isCursed } from "../curse/curse";

const getItemPrefix = (item: ItemEntity) => {
  const cursed = isCursed(item);
  return cursed ? CURSED_PREFIX : undefined;
};

export const getItemName = (item?: ItemEntity) => {
  if (!item) {
    throw new Error("No item to get name from");
  }
  const name = getComponentByType(item, NameComponent)?.name;
  if (name === undefined) {
    throw new Error("Unnamed item");
  }
  return [getItemPrefix(item), name].filter(Boolean).join(" ");
};
