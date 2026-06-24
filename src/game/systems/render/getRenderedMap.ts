import { getComponentByType } from "../../../core/ecs/queries/component";
import { COLORS } from "../../../utils/colors";
import { MISSING_COLOR, MISSING_GLYPH } from "../../../utils/constants";
import { AppearanceComponent } from "../../model/components/display/AppearanceComponent";
import { ColorComponent } from "../../model/components/display/ColorComponent";
import { GlyphComponent } from "../../model/components/display/GlyphComponent";
import type { PlayerEntity } from "../../model/entities/PlayerEntity";
import { getPlayer } from "../../state/selectors/player";
import type { GameState, Tile } from "../../state/state";
import { pickUpItem } from "../pickUp/pickUp";
import { getVisibleTiles } from "./getVisibleTiles";
import { RenderedTile } from "./types";

const resolveGlyph = (tile: Tile, player: PlayerEntity | undefined) => {
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

  return playerGlyph ?? mobGlyph ?? itemGlyph ?? floorGlyph ?? MISSING_GLYPH;
};

const resolveColor = (tile: Tile, player: PlayerEntity | undefined) => {
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

export const getRenderedMap = (gameState: GameState) => {
  const renderedMap: RenderedTile[] = getVisibleTiles(gameState).map((tile) => {
    const floorAppearance = getComponentByType(tile.floor, AppearanceComponent);
    const { player: playerEntity, position: playerPosition } =
      getPlayer(gameState);
    const player = playerPosition === tile.position ? playerEntity : undefined;

    return new RenderedTile({
      char: resolveGlyph(tile, player),
      background: floorAppearance?.background ?? MISSING_COLOR,
      color: resolveColor(tile, player),
      position: tile.position,
    });
  });

  return renderedMap;
};
