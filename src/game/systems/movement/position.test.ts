import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getEntityCreator } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { createGame, type Game } from "../../../game";
import { clearItems, clearMobs } from "../../../tests/clear";
import {
  expectGameStateConsistent,
  integrityCheckEnabled,
} from "../../../tests/integrity";
import { PositionComponent } from "../../model/components/spatial/PositionComponent";
import { InternalActionType } from "../internal/type";
import { Direction } from "../turn/types";
import { getDirection } from "./position";

const PositionedEntity = getEntityCreator("TEST_DIRECTION_ENTITY");

const createAt = (position: number) => {
  const entity = PositionedEntity();
  upsertComponents(entity, PositionComponent({ position }));
  return entity;
};

describe("getDirection", () => {
  let game: Game;

  beforeEach(() => {
    game = createGame();
    game.dispatch({ type: InternalActionType.INIT });
    clearMobs(game);
    clearItems(game);
  });

  afterEach(() => {
    if (integrityCheckEnabled()) {
      expectGameStateConsistent(game);
    }

    vi.restoreAllMocks();
  });

  it("returns LEFT when target position is lower", () => {
    expect(getDirection(createAt(10), createAt(9))).toBe(Direction.LEFT);
  });

  it("returns RIGHT when target position is higher", () => {
    expect(getDirection(createAt(10), createAt(11))).toBe(Direction.RIGHT);
  });

  it("returns undefined when positions are equal", () => {
    expect(getDirection(createAt(10), createAt(10))).toBeUndefined();
  });
});
