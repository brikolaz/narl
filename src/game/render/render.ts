import type { ColoredGlyphView, GameViewModel } from "./getGameViewModel";

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

const gameOver = document.createElement("pre");
gameOver.className = "game-over";
gameOver.setAttribute("aria-label", "Game over");

const win = document.createElement("pre");
win.className = "game-over";
win.setAttribute("aria-label", "You won");

// TODO: get it from game view (no hardcoded keys)
const controls = document.createElement("pre");
controls.className = "controls";
controls.setAttribute("aria-label", "Keyboard controls");
controls.textContent =
  "[←/→] Move  [G] Pick Up  [I] Inspect  [E] Equip  [U] Unequip\n[M] Move Item  [D] Drop  [P] Poke  [W] Wait";

document.body.append(controls);

const game = document.createElement("main");
game.className = "game";
game.append(stats, map);

const inventory = document.createElement("aside");
inventory.className = "inventory";
inventory.append(eq, backpack);

const renderGameLayout = () => {
  if (
    inventory.parentElement === root &&
    game.parentElement === root &&
    log.parentElement === root
  ) {
    return;
  }

  root.replaceChildren(inventory, game, log);
};

renderGameLayout();

const renderGameOver = ({ turn, epitaph }: GameViewModel["death"]) => {
  gameOver.textContent = [
    "",
    "GAME OVER",
    "",
    "Died at:",
    `Turn ${turn}`,
    "",
    "Killed by:",
    `${epitaph}`,
    "",
    "",
    "Press any key to restart",
  ].join("\n");

  root.replaceChildren(gameOver);
};

const renderWin = () => {
  win.textContent = [
    "",
    "You won!",
    "",
    "Don't get used to it",
    "",
    "",
    "Press any key to restart",
  ].join("\n");

  root.replaceChildren(win);
};

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
  glyphs: ColoredGlyphView[],
) => {
  const border = "+---+---+---+";
  const fragment = document.createDocumentFragment();

  fragment.append(`${border}\n`);

  Array.from({ length: 3 }, (_, row) => {
    const offset = row * 3;

    fragment.append("| ");
    appendColoredGlyph(fragment, glyphs[offset]);

    fragment.append(" | ");
    appendColoredGlyph(fragment, glyphs[offset + 1]);

    fragment.append(" | ");
    appendColoredGlyph(fragment, glyphs[offset + 2]);

    fragment.append(` |\n${border}`, row < 2 ? "\n" : "");
  });

  target.replaceChildren(fragment);
};

const renderEqGrid = (
  target: HTMLElement,
  glyphs: ColoredGlyphView[],
) => {
  const fragment = document.createDocumentFragment();

  const appendText = (text: string) => {
    fragment.append(text);
  };

  appendText(`
    +---+
    | `);

  appendColoredGlyph(fragment, glyphs[0]);

  appendText(` |
+---+---+---+
| `);

  appendColoredGlyph(fragment, glyphs[1]);

  appendText(` | `);

  appendColoredGlyph(fragment, glyphs[2]);

  appendText(` | `);

  appendColoredGlyph(fragment, glyphs[3]);

  appendText(` |
+---+---+---+
    | `);

  appendColoredGlyph(fragment, glyphs[4]);

  appendText(` |
    +---+
    | `);

  appendColoredGlyph(fragment, glyphs[5]);

  appendText(` |
    +---+`);

  target.replaceChildren(fragment);
};

export const render = (viewModel: GameViewModel) => {
  if (viewModel.win()) {
    controls.hidden = true;
    renderWin();
    return;
  }

  if (viewModel.gameOver()) {
    controls.hidden = true;
    renderGameOver(viewModel.death);
    return;
  }

  controls.hidden = false;
  renderGameLayout();

  stats.textContent = Object.entries(viewModel.playerStats)
    .map(([stat, value]) => `${stat}: ${value}`)
    .join("\n");

  renderMap(map, viewModel.map);
  renderAsciiGrid(backpack, viewModel.backpack);
  renderEqGrid(eq, viewModel.equipment);

  log.textContent = viewModel.logs
    .map((entry) => entry.text)
    .join("\n");
  log.scrollTop = log.scrollHeight;
};
