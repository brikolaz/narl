import { getComponentByType } from "../../core/ecs/queries/component";
import { GlyphComponent, ItemEntity } from "../model";
import { ColorComponent } from "../model/components/ColorComponent";

type Item = {
  glyph: string | undefined;
  color: string | undefined;
};

export const useItem = (item?: ItemEntity): Item => {
  if (!item) {
    return {} as Item;
  }
  const { glyph } = getComponentByType(item, GlyphComponent) ?? {};
  const { color } = getComponentByType(item, ColorComponent) ?? {};

  return { glyph, color };
};
