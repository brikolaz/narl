import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createGame, type Game } from "../../../game";
import { GAME_STATUS } from "../../state/state";
import { InternalActionType } from "../internal/type";
import * as seed from "../rng/seed";
import { WorldActionType } from "../world/types";

describe("resolveInternalResetGameAction", () => {
  let game: Game;

  beforeEach(() => {
    game = createGame();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates the initial seed once when creating a game", () => {
    const generateSeed = vi
      .spyOn(seed, "generateSeed")
      .mockReturnValue("initial-seed");

    createGame();

    expect(generateSeed).toHaveBeenCalledOnce();
    expect(game.state.seed).toBe("initial-seed");
  });

  describe("starts a new game with a new seed", () => {
    it("with GAME_OVER status", () => {
      vi.spyOn(seed, "generateSeed").mockReturnValue("new-seed");

      game.dispatch({ type: InternalActionType.INIT });
      game.dispatch({ type: WorldActionType.PENDING_GAME_OVER });
      game.dispatch({ type: WorldActionType.GAME_OVER });
      game.dispatch();

      expect(game.state.status).toBe(GAME_STATUS.ACTIVE);
      expect(seed.generateSeed).toHaveBeenCalledOnce();
      expect(game.state.seed).toBe("new-seed");
    });

    it("with WIN status", () => {
      vi.spyOn(seed, "generateSeed").mockReturnValue("new-seed");

      game.dispatch({ type: WorldActionType.WIN });
      game.dispatch();

      expect(game.state.status).toBe(GAME_STATUS.ACTIVE);
      expect(seed.generateSeed).toHaveBeenCalledOnce();
      expect(game.state.seed).toBe("new-seed");
    });
  });

  describe("rejects reset", () => {
    it("while game is INACTIVE", () => {
      expect(game.state.status).toBe(GAME_STATUS.INACTIVE);
      expect(() =>
        game.dispatch({ type: InternalActionType.RESET_GAME }),
      ).toThrow("Can't reset an active game");
    });

    it("while game is ACTIVE", () => {
      game.dispatch({ type: InternalActionType.INIT });

      expect(game.state.status).toBe(GAME_STATUS.ACTIVE);
      expect(() =>
        game.dispatch({ type: InternalActionType.RESET_GAME }),
      ).toThrow("Can't reset an active game");
    });
  });
});
