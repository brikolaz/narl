import type { ColoredGlyphView, GameViewModel } from "./getGameViewModel";
import type { EqSlot } from "./state/eq";

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
game.append(stats, map);

const inventory = document.createElement("aside");
inventory.className = "inventory";
inventory.append(eq, backpack);

root.append(inventory, game, log);

const appendColoredGlyph = (
  target: DocumentFragment | HTMLElement,
  glyph: ColoredGlyphView,
) => {
  const char = glyph?.char || " ";

  if (!glyph?.color && !glyph?.background) {
    target.append(char);
    return;
  }

  const coloredGlyph = document.createElement("span");
  if (glyph.color) {
    coloredGlyph.style.color = glyph.color;
  }
  if (glyph.background) {
    coloredGlyph.style.backgroundColor = glyph.background;
  }
  coloredGlyph.textContent = char;
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

const renderEqGrid = (target: HTMLElement, glyphs: ColoredGlyphView[]) => {
  const fragment = document.createDocumentFragment();

  const appendText = (text: string) => {
    fragment.append(text);
  };

  appendText(`
     E Q
    +---+
    | `);

  appendColoredGlyph(fragment, glyphs[0]);

  appendText(` |
    | 1 |
+---+---+---+
| `);

  appendColoredGlyph(fragment, glyphs[1]);

  appendText(` | `);

  appendColoredGlyph(fragment, glyphs[2]);

  appendText(` | `);

  appendColoredGlyph(fragment, glyphs[3]);

  appendText(` |
| 2 | 3 | 4 |
+---+---+---+
    | `);

  appendColoredGlyph(fragment, glyphs[4]);

  appendText(` |
    | 5 |
    +---+
    | `);

  appendColoredGlyph(fragment, glyphs[5]);

  appendText(` |
    | 6 |
    +---+`);

  target.replaceChildren(fragment);
};

const eqSlots = [
  [null, 1, null],
  [2, 3, 4],
  [null, 5, null],
  [null, 6, null],
] as const;

type Direction = "left" | "right" | "up" | "down";
type AdjacentEqSlots = Record<Direction, EqSlot | undefined>;

export const getAdjacentEqSlots = (
  currentSlot: 1 | 2 | 3 | 4 | 5 | 6,
): AdjacentEqSlots => {
  let x = -1;
  let y = -1;

  for (let row = 0; row < eqSlots.length; row++) {
    const column = eqSlots[row].findIndex((slot) => slot === currentSlot);

    if (column !== -1) {
      x = column;
      y = row;
      break;
    }
  }

  if (x === -1 || y === -1) {
    return {
      left: undefined,
      right: undefined,
      up: undefined,
      down: undefined,
    };
  }

  return {
    left: eqSlots[y]?.[x - 1] ?? undefined,
    right: eqSlots[y]?.[x + 1] ?? undefined,
    up: eqSlots[y - 1]?.[x] ?? undefined,
    down: eqSlots[y + 1]?.[x] ?? undefined,
  };
};

export const render = (viewModel: GameViewModel) => {
  stats.textContent = Object.entries(viewModel.playerStats)
    .map(([stat, value]) => `${stat}: ${value}`)
    .join("\n");
  renderMap(map, viewModel.map);
  renderAsciiGrid(backpack, "BACKPACK", viewModel.backpack);
  renderEqGrid(eq, viewModel.equipment);
  log.textContent = viewModel.logs.map((entry) => entry.text).join("\n");
};
