import { getComponentByType } from "../../../core/ecs/queries/component";
import { COLORS } from "../../../utils/colors";
import { MISSING_COLOR, MISSING_GLYPH } from "../../../utils/constants";
import { AppearanceComponent } from "../../model/components/AppearanceComponent";
import { ColorComponent } from "../../model/components/ColorComponent";
import { GlyphComponent } from "../../model/components/GlyphComponent";
import type { GameState, Tile } from "../../state/state";
import { pickUpItem } from "../pickUp";
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
  const mobs = tile.mobs;
  const lastMob = mobs.at(-1);
  const mobGlyph = lastMob
    ? getComponentByType(lastMob, GlyphComponent)?.glyph
    : undefined;

  return playerGlyph ?? mobGlyph ?? itemGlyph ?? floorGlyph ?? MISSING_GLYPH;
};

const resolveColor = (tile: Tile) => {
  const playerColor = tile.player
    ? getComponentByType(tile.player, ColorComponent)?.color
    : undefined;
  const floorColor = getComponentByType(tile.floor, ColorComponent)?.color;
  const lastItem = pickUpItem(tile);
  const itemColor = lastItem
    ? getComponentByType(lastItem, ColorComponent)?.color
    : undefined;
  const mobs = tile.mobs;
  const lastMob = mobs.at(-1);
  const mobColor = lastMob
    ? getComponentByType(lastMob, ColorComponent)?.color
    : undefined;

  return playerColor ?? mobColor ?? itemColor ?? floorColor ?? COLORS.DEFAULT;
};

export const getRenderedMap = (gameState: GameState) => {
  const renderedMap: RenderedTile[] = gameState.world.map((tile) => {
    const floorAppearance = getComponentByType(tile.floor, AppearanceComponent);

    return new RenderedTile({
      char: resolveGlyph(tile),
      background: floorAppearance?.background ?? MISSING_COLOR,
      color: resolveColor(tile)
    });
  });

  return renderedMap;
};
