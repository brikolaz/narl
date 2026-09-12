/// <reference types="node" />

import process from "node:process";
import { expectComponentStateConsistent } from "../core/model/queries/components/tests";
import { expectEntityStateConsistent } from "../core/model/queries/entities/tests";
import type { Game } from "../game";

export const integrityCheckEnabled = (): boolean =>
  process.env.TEST_INTEGRITY === "1";

export const expectGameStateConsistent = (game: Game): void => {
  expectEntityStateConsistent(game.state);
  expectComponentStateConsistent(game.state);
};
