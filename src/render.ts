import { getComponentByType } from "./core/ecs/queries/components/get";
import { GlyphComponent } from "./game/model/components/display/GlyphComponent";
import {
  getBackpack,
  getContainerItemAt,
} from "./game/model/queries/containers";
import { getEqSlotItem } from "./game/model/queries/eq";
import { getPlayerEntity } from "./game/model/queries/player";
import type { GameState } from "./game/state/state";
import { EqSlot } from "./game/systems/eq/types";
import { getRenderedMap } from "./game/systems/render/getRenderedMap";
import { getEqStats } from "./game/systems/stats/eqStats";
import { getPlayerStats } from "./game/systems/stats/playerStats";
import "./index.css";

const root = document.querySelector<HTMLDivElement>("#root");

if (!root) {
  throw new Error("Missing #root element");
}

const map = document.createElement("pre");
map.className = "map";
map.setAttribute("aria-label", "Game map");

const stats = document.createElement("pre");
stats.className = "stats";
stats.setAttribute("aria-label", "Player stats");

const backpack = document.createElement("pre");
backpack.className = "backpack";
backpack.setAttribute("aria-label", "Player backpack");

const eq = document.createElement("pre");
eq.className = "eq";
eq.setAttribute("aria-label", "Player equipment");

const log = document.createElement("pre");
log.className = "log";
log.setAttribute("aria-label", "Game log");

const game = document.createElement("main");
game.className = "game";
game.append(stats, map, log);

const inventory = document.createElement("aside");
inventory.className = "inventory";
inventory.append(eq, backpack);

const inventorySpacer = document.createElement("aside");
inventorySpacer.className = "inventory-spacer";
inventorySpacer.setAttribute("aria-hidden", "true");

root.append(inventory, game, inventorySpacer);

const renderAsciiGrid = (title: string, glyphs: string[]) => {
  const border = "+---+---+---+";
  const rows = Array.from({ length: 3 }, (_, row) => {
    const offset = row * 3;
    return [
      `| ${glyphs[offset]} | ${glyphs[offset + 1]} | ${glyphs[offset + 2]} |`,
      `| ${offset + 1} | ${offset + 2} | ${offset + 3} |`,
    ].join("\n");
  });

  return [title, border, ...rows.flatMap((row) => [row, border])].join("\n");
};

export const render = (state: GameState) => {
  const player = getPlayerEntity(state);

  stats.textContent = Object.entries({
    ...getPlayerStats(player),
    ...getEqStats(player),
  })
    .map(([stat, value]) => `${stat}: ${value}`)
    .join("\n");

  map.textContent = getRenderedMap(state)
    .map((tile) => tile.char)
    .join("");

  const playerBackpack = getBackpack(player);
  const backpackGlyphs = Array.from({ length: 9 }, (_, index) => {
    const item = playerBackpack
      ? getContainerItemAt(playerBackpack, index + 1)
      : undefined;
    return getComponentByType(item, GlyphComponent)?.glyph ?? " ";
  });
  backpack.textContent = renderAsciiGrid("BACKPACK", backpackGlyphs);

  const eqGlyphs = Array.from({ length: 9 }, (_, index) => {
    const item = getEqSlotItem(player, (index + 1) as EqSlot);
    return getComponentByType(item, GlyphComponent)?.glyph ?? " ";
  });
  eq.textContent = renderAsciiGrid("EQ", eqGlyphs);

  log.textContent = state.log
    .map((entry) => `[${entry.turn}] ${entry.message}`)
    .join("\n");
};
