import type { Entity } from "../../core/ecs/Entity";
import { getComponentByType } from "../../core/ecs/queries/components/get";
import { ColorComponent } from "../model/components/display/ColorComponent";
import { GlyphComponent } from "../model/components/display/GlyphComponent";

type Item = {
  glyph: string | undefined;
  color: string | undefined;
};

export const useItem = (item?: Entity): Item => {
  if (!item) {
    return {} as Item;
  }
  const { glyph } = getComponentByType(item, GlyphComponent) ?? {};
  const { color } = getComponentByType(item, ColorComponent) ?? {};

  return { glyph, color };
};
