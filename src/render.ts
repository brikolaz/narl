import { getComponentByType } from "./core/ecs/queries/components/get";
import { ColorComponent } from "./game/model/components/display/ColorComponent";
import { GlyphComponent } from "./game/model/components/display/GlyphComponent";
import {
  getBackpack,
  getContainerItemAt,
} from "./game/model/queries/containers";
import { getEqSlotItem } from "./game/model/queries/eq";
import { getPlayerEntity } from "./game/model/queries/player";
import type { GameState } from "./game/state/state";
import { EqSlot } from "./game/systems/eq/types";
import { ALL_CONTAINER_SLOTS } from "./game/systems/containers/types";
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

type ColoredGlyph = {
  char: string;
  color?: string;
};

const appendColoredGlyph = (
  target: DocumentFragment | HTMLElement,
  glyph: ColoredGlyph,
) => {
  if (!glyph.color) {
    target.append(glyph.char);
    return;
  }

  const coloredGlyph = document.createElement("span");
  coloredGlyph.style.color = glyph.color;
  coloredGlyph.textContent = glyph.char;
  target.append(coloredGlyph);
};

const renderColoredGlyphs = (target: HTMLElement, glyphs: ColoredGlyph[]) => {
  const fragment = document.createDocumentFragment();
  glyphs.forEach((glyph) => appendColoredGlyph(fragment, glyph));
  target.replaceChildren(fragment);
};

const renderAsciiGrid = (
  target: HTMLElement,
  title: string,
  glyphs: ColoredGlyph[],
) => {
  const border = "+---+---+---+";
  const fragment = document.createDocumentFragment();
  fragment.append(`${title}\n${border}\n`);

  Array.from({ length: 3 }, (_, row) => {
    const offset = row * 3;
    fragment.append("| ");
    appendColoredGlyph(fragment, glyphs[offset]);
    fragment.append(" | ");
    appendColoredGlyph(fragment, glyphs[offset + 1]);
    fragment.append(" | ");
    appendColoredGlyph(fragment, glyphs[offset + 2]);
    fragment.append(
      ` |\n| ${offset + 1} | ${offset + 2} | ${offset + 3} |\n${border}`,
      row < 2 ? "\n" : "",
    );
  });

  target.replaceChildren(fragment);
};

export const render = (state: GameState) => {
  const player = getPlayerEntity(state);

  stats.textContent = Object.entries({
    ...getPlayerStats(player),
    ...getEqStats(player),
  })
    .map(([stat, value]) => `${stat}: ${value}`)
    .join("\n");

  renderColoredGlyphs(
    map,
    getRenderedMap(state).map((tile) => ({
      char: tile.char ?? " ",
      color: tile.color,
    })),
  );

  const playerBackpack = getBackpack(player);
  const backpackGlyphs = [...ALL_CONTAINER_SLOTS].map((slot) => {
    const item = playerBackpack
      ? getContainerItemAt(playerBackpack, slot)
      : undefined;
    return {
      char: getComponentByType(item, GlyphComponent)?.glyph ?? " ",
      color: getComponentByType(item, ColorComponent)?.color,
    };
  });
  renderAsciiGrid(backpack, "BACKPACK", backpackGlyphs);

  const eqSlots = Object.values(EqSlot).filter(
    (slot): slot is EqSlot => typeof slot === "number",
  );
  const eqGlyphs = eqSlots.map((slot) => {
    const item = getEqSlotItem(player, slot);
    return {
      char: getComponentByType(item, GlyphComponent)?.glyph ?? " ",
      color: getComponentByType(item, ColorComponent)?.color,
    };
  });
  renderAsciiGrid(eq, "EQ", eqGlyphs);

  log.textContent = state.log
    .map((entry) => `[${entry.turn}] ${entry.message}`)
    .join("\n");
};
