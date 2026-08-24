export class EXP {
  private static visitedTile = 10;

  static get VISITED_TILE() {
    return this.visitedTile;
  }

  static get INITIAL_VISITED_TILE() {
    return this.visitedTile * 2;
  }
}
