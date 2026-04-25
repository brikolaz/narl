import { getComponentByType } from "../../../core/ecs/queries/component";
import { MISSING_COLOR, MISSING_GLYPH } from "../../../utils/constants";
import { AppearanceComponent } from "../../model/components/AppearanceComponent";
import { GlyphComponent } from "../../model/components/GlyphComponent";
import type { GameState, Tile } from "../../state/state";
import { RenderedTile } from "./types";

const resolveGlyph = (tile: Tile) => {
  const playerGlyph = tile.player
    ? getComponentByType(tile.player, GlyphComponent)?.glyph
    : undefined;
  const floorGlyph = getComponentByType(tile.floor, GlyphComponent)?.glyph;
  const items = tile.items;
  const lastItem = items.at(-1);
  const itemGlyph = lastItem
    ? getComponentByType(lastItem, GlyphComponent)?.glyph
    : undefined;

  return playerGlyph ?? itemGlyph ?? floorGlyph ?? MISSING_GLYPH;
};

export const getRenderedMap = (gameState: GameState) => {
  const renderedMap: RenderedTile[] = gameState.world.map((tile) => {
    const floorAppearance = getComponentByType(tile.floor, AppearanceComponent);

    return new RenderedTile({
      char: resolveGlyph(tile),
      background: floorAppearance?.background ?? MISSING_COLOR,
    });
  });

  return renderedMap;
};
