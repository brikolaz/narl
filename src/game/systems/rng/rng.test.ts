import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createGame, type Game } from "../../../game";
import {
  expectGameStateConsistent,
  integrityCheckEnabled,
} from "../../../tests/integrity";
import { MOBS_RNG_NAMESPACE } from "../../../utils/constants";
import { STATE } from "../../state/state";
import { InternalActionType } from "../internal/type";
import { Random } from "./random";

describe("world RNG", () => {
  let game: Game;

  beforeEach(() => {
    game = createGame();
  });

  afterEach(() => {
    if (integrityCheckEnabled()) {
      expectGameStateConsistent(game);
    }

    vi.restoreAllMocks();
  });

  it("uses and preserves the seed known before game initialization", () => {
    const initialSeed = STATE.seed;
    const expected = new Random({
      seed: initialSeed,
      namespace: MOBS_RNG_NAMESPACE,
    });

    game.dispatch({ type: InternalActionType.INIT });

    expect(STATE.seed).toBe(initialSeed);
    expect(STATE.rng.mobs.random()).toBe(expected.random());
  });
});
