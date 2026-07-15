import { getEntityCreator } from "../../../core/ecs/Entity";
import { upsertComponents } from "../../../core/ecs/queries/components/add";
import { AppearanceComponent } from "../components/display/AppearanceComponent";
import { ColorComponent } from "../components/display/ColorComponent";
import { GlyphComponent } from "../components/display/GlyphComponent";
import type { Factory } from "../Factory";

export const FloorEntity = getEntityCreator("FLOOR");
export const FloorEntityFactory: Factory = {
  getDefault: () => {
    const floor = FloorEntity();
    upsertComponents(
      floor,
      ColorComponent({ color: "gray" }),
      AppearanceComponent(),
      GlyphComponent({ glyph: "." }),
    );
    return floor;
  },
};
