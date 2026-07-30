import { getComponentByType } from "../../core/model/queries/components/get";
import { ColorComponent } from "../model/components/display/ColorComponent";
import { GlyphComponent } from "../model/components/display/GlyphComponent";
import { PositionComponent } from "../model/components/PositionComponent";
import { getBackpack, getContainerItemAt } from "../model/queries/containers";
import { getEq } from "../model/queries/eq";
import { getPlayerEntity } from "../model/queries/player";
import { STATE } from "../state/state";
import { ALL_CONTAINER_SLOTS } from "../systems/containers/types";
import { getEqStats } from "../systems/stats/eqStats";
import { getPlayerStats } from "../systems/stats/playerStats";
import { getRenderedMap } from "./getRenderedMap";
import { getHighlightedEqSlot } from "./state/highlights";

export type ColoredGlyphView = {
  char: string;
  color?: string;
  background?: string;
};

export type RenderedMap = Array<ColoredGlyphView & { position: number }>;
export type PlayerStatsView = Record<string, string | number>;
export type EquipmentView = ColoredGlyphView[];
export type BackpackView = ColoredGlyphView[];
export type LogEntryView = { text: string };

export type GameViewModel = {
  map: RenderedMap;
  playerStats: PlayerStatsView;
  equipment: EquipmentView;
  backpack: BackpackView;
  logs: LogEntryView[];
};

const getGlyphView = (
  entity: Parameters<typeof getComponentByType>[0],
): ColoredGlyphView => {
  return {
    char:
      getComponentByType(entity, GlyphComponent)?.glyph ??
      GlyphComponent.defaults.glyph,
    color: getComponentByType(entity, ColorComponent)?.color,
  };
};

const getHighlightedGlyphView = (
  entity: Parameters<typeof getComponentByType>[0],
  position: number,
): ColoredGlyphView => {
  return {
    char:
      getComponentByType(entity, GlyphComponent)?.glyph ??
      GlyphComponent.defaults.glyph,
    color: getComponentByType(entity, ColorComponent)?.color,
    background: position === getHighlightedEqSlot() ? "#630057" : undefined,
  };
};

export const getPlayerStatsView = (): PlayerStatsView => {
  const player = getPlayerEntity();

  return {
    ...getPlayerStats(player),
    ...getEqStats(player),
  };
};

export const getEquipmentView = (): EquipmentView => {
  const player = getPlayerEntity();
  const slots = getEq(player);

  return slots.map((slot) =>
    getHighlightedGlyphView(
      getContainerItemAt(slot, 1),
      getComponentByType(slot, PositionComponent)?.position ?? -1,
    ),
  );
};

export const getBackpackView = (): BackpackView => {
  const backpack = getBackpack(getPlayerEntity());

  return [...ALL_CONTAINER_SLOTS].map((slot) =>
    getGlyphView(backpack ? getContainerItemAt(backpack, slot) : undefined),
  );
};

export const getLogsView = (): LogEntryView[] =>
  STATE.log.map((entry) => ({
    text: `[${entry.turn}] ${entry.message}`,
  }));

export const getGameViewModel = (): GameViewModel => ({
  map: getRenderedMap().map((tile) => ({
    char: tile.char ?? " ",
    color: tile.color,
    position: tile.position,
  })),
  playerStats: getPlayerStatsView(),
  equipment: getEquipmentView(),
  backpack: getBackpackView(),
  logs: getLogsView(),
});
