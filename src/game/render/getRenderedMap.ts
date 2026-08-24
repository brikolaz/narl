import type { Entity } from "../../core/model/Entity";
import { getComponentByType } from "../../core/model/queries/components/get";
import { COLORS } from "../../utils/colors";
import { AppearanceComponent } from "../model/components/display/AppearanceComponent";
import { ColorComponent } from "../model/components/display/ColorComponent";
import { GlyphComponent } from "../model/components/display/GlyphComponent";
import { pickUpItem } from "../model/queries/pickUp";
import { getPlayer } from "../model/queries/player";
import { getPosition } from "../model/queries/position";
import type { Tile } from "../state/state";
import { getVisibleTiles } from "../systems/player/getVisibleTiles";
import { RenderedTile } from "./types";

const resolveGlyph = (tile: Tile, player: Entity | undefined) => {
  const playerGlyph = getComponentByType(player, GlyphComponent)?.glyph;
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

  return (
    playerGlyph ??
    mobGlyph ??
    itemGlyph ??
    floorGlyph ??
    RenderedTile.DEFAULT_CHAR
  );
};

const resolveColor = (tile: Tile, player: Entity | undefined) => {
  const playerColor = getComponentByType(player, ColorComponent)?.color;
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

const getRenderedTilePosition = (tile: Tile) => {
  return tile.position + 1;
};

export const getRenderedMap = () => {
  const renderedMap: RenderedTile[] = getVisibleTiles().map((tile) => {
    const floorAppearance = getComponentByType(tile.floor, AppearanceComponent);
    const playerEntity = getPlayer();
    const player =
      getPosition(playerEntity) === tile.position ? playerEntity : undefined;

    return new RenderedTile({
      char: resolveGlyph(tile, player),
      background: floorAppearance?.background ?? COLORS.MISSING_COLOR,
      color: resolveColor(tile, player),
      position: getRenderedTilePosition(tile),
    });
  });

  return renderedMap;
};
