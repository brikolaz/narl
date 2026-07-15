import type {
  ColoredGlyphView,
  GameViewModel,
} from "./game/view/getGameViewModel";
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

const appendColoredGlyph = (
  target: DocumentFragment | HTMLElement,
  glyph: ColoredGlyphView,
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

const renderMap = (
  target: HTMLElement,
  tiles: Array<ColoredGlyphView & { position: number }>,
) => {
  const fragment = document.createDocumentFragment();
  const glyphs = document.createElement("span");
  glyphs.className = "map-row";
  tiles.forEach((tile) => {
    const glyph = document.createElement("span");
    appendColoredGlyph(glyph, tile);
    glyphs.append(glyph);
  });

  const positions = document.createElement("span");
  positions.className = "map-positions";
  [glyphs, positions].forEach((row) => {
    row.style.gridTemplateColumns = `repeat(${tiles.length}, 1fr)`;
    row.style.width = `${tiles.length * 1.15}em`;
  });
  tiles.forEach((tile) => {
    const position = document.createElement("span");
    position.className = "map-position";
    position.textContent = String(tile.position).padEnd(4).split("").join("\n");
    positions.append(position);
  });

  fragment.append(glyphs, "\n", positions);

  target.replaceChildren(fragment);
};

const renderAsciiGrid = (
  target: HTMLElement,
  title: string,
  glyphs: ColoredGlyphView[],
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

export const render = (viewModel: GameViewModel) => {
  stats.textContent = Object.entries(viewModel.playerStats)
    .map(([stat, value]) => `${stat}: ${value}`)
    .join("\n");

  renderMap(map, viewModel.map);
  renderAsciiGrid(backpack, "BACKPACK", viewModel.backpack);
  renderAsciiGrid(eq, "EQ", viewModel.equipment);
  log.textContent = viewModel.logs.map((entry) => entry.text).join("\n");
};
