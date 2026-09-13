export class Exp {
  private static baseVisitedTile = 10

  static get visitedTile() {
    return this.baseVisitedTile
  }

  static get initialVisitedTile() {
    return this.baseVisitedTile * 2
  }
}
