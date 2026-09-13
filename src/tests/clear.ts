import type { Game } from "../game"

export const clearMobs = (game: Game): void => {
  for (const tile of game.state.world) {
    if (tile) {
      tile.mobs = []
    }
  }
}

export const clearItems = (game: Game): void => {
  for (const tile of game.state.world) {
    if (tile) {
      tile.items = []
    }
  }
}
