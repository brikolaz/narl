import { getComponentByType } from "../../core/ecs/queries/components/get";
import { ColorComponent } from "../model/components/display/ColorComponent";
import { GlyphComponent } from "../model/components/display/GlyphComponent";
import { getBackpack, getContainerItemAt } from "../model/queries/containers";
import { getEqSlotItem } from "../model/queries/eq";
import { getPlayerEntity } from "../model/queries/player";
import { getRenderedMap } from "./getRenderedMap";
import type { GameState } from "../state/state";
import { ALL_CONTAINER_SLOTS } from "../systems/containers/types";
import { EqSlot } from "../systems/eq/types";
import { getEqStats } from "../systems/stats/eqStats";
import { getPlayerStats } from "../systems/stats/playerStats";

export type ColoredGlyphView = {
  char: string;
  color?: string;
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

const getGlyphView = (entity: Parameters<typeof getComponentByType>[0]) => ({
  char:
    getComponentByType(entity, GlyphComponent)?.glyph ??
    GlyphComponent.defaults.glyph,
  color: getComponentByType(entity, ColorComponent)?.color,
});

export const getPlayerStatsView = (state: GameState): PlayerStatsView => {
  const player = getPlayerEntity(state);

  return {
    ...getPlayerStats(player),
    ...getEqStats(player),
  };
};

export const getEquipmentView = (state: GameState): EquipmentView => {
  const player = getPlayerEntity(state);
  const slots = Object.values(EqSlot).filter(
    (slot): slot is EqSlot => typeof slot === "number",
  );

  return slots.map((slot) => getGlyphView(getEqSlotItem(player, slot)));
};

export const getBackpackView = (state: GameState): BackpackView => {
  const backpack = getBackpack(getPlayerEntity(state));

  return [...ALL_CONTAINER_SLOTS].map((slot) =>
    getGlyphView(backpack ? getContainerItemAt(backpack, slot) : undefined),
  );
};

export const getLogsView = (state: GameState): LogEntryView[] =>
  state.log.map((entry) => ({
    text: `[${entry.turn}] ${entry.message}`,
  }));

export const getGameViewModel = (state: GameState): GameViewModel => ({
  map: getRenderedMap(state).map((tile) => ({
    char: tile.char ?? " ",
    color: tile.color,
    position: tile.position,
  })),
  playerStats: getPlayerStatsView(state),
  equipment: getEquipmentView(state),
  backpack: getBackpackView(state),
  logs: getLogsView(state),
});
