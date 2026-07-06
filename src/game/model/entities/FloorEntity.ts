import {
  Entity
} from "../../../core/ecs/Entity";
import { addComponents } from "../../../core/ecs/queries/components/add";
import { AppearanceComponent } from "../components/display/AppearanceComponent";
import { ColorComponent } from "../components/display/ColorComponent";
import { GlyphComponent } from "../components/display/GlyphComponent";
import type { Factory } from "../Factory";

export const FloorEntityFactory: Factory = {
  getDefault: () => {
    const floor = Entity();
    addComponents(
      floor,
      ColorComponent({ color: "gray" }),
      AppearanceComponent(),
      GlyphComponent({ glyph: "." }),
    );
    return floor;
  },
};
