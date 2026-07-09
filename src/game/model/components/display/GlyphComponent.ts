import { Component, getComponentCreator } from "../../../../core/ecs/Component";

export type GlyphComponentProps = {
  glyph: string;
};

export const GlyphComponent = getComponentCreator<GlyphComponentProps>(
  "GLYPH",
  {
    glyph: "",
  },
);
