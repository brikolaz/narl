import { getComponentCreator } from "../../../../core/model/Component";

export type GlyphComponentProps = {
  glyph: string;
};

export const GlyphComponent = getComponentCreator<GlyphComponentProps>(
  "GLYPH",
  {
    glyph: "",
  },
);
