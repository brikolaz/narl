import { getEntityCreator } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { AppearanceComponent } from "../components/display/AppearanceComponent";
import { ColorComponent } from "../components/display/ColorComponent";
import { GlyphComponent } from "../components/display/GlyphComponent";
import type { Factory } from "../Factory";

const FloorEntity = getEntityCreator("FLOOR");
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
