import { getEntityCreator } from "../../../../core/ecs/Entity";
import { addComponents } from "../../../../core/ecs/queries/components/add";
import { PlaceholderComponent } from "../../components/containers/PlaceholderComponent";
import type { ItemFactory } from "../../Factory";

export const PlaceholderEntity = getEntityCreator("PLACEHOLDER");

export const PlaceholderEntityFactory: ItemFactory = {
  getDefault: () => {
    const placeholder = PlaceholderEntity();

    addComponents(placeholder, PlaceholderComponent());

    return placeholder;
  },
};
