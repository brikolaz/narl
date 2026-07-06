import { Component } from "../../../../core/ecs/Component";

export type GlyphComponentProps = {
  glyph: string;
};

export const GlyphComponent = Component<GlyphComponentProps>(
  "GLYPH",
  {
    glyph: "",
  },
);
