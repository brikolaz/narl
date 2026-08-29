import { getEntityCreator } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { GlyphComponent } from "../components/display/GlyphComponent";
import { NameComponent } from "../components/display/NameComponent";
import { ImpassableComponent } from "../components/ImpassableComponent";
import type { Factory } from "../Factory";

export const WallEntity = getEntityCreator("WALL");

export const WallEntityFactory: Factory = {
  getDefault: () => {
    const wall = WallEntity();

    upsertComponents(wall, 
      NameComponent({name: 'Wall'}),
      GlyphComponent({glyph: '#'}),
      ImpassableComponent()
    )
    return wall;
  },
};
