import { beforeEach, describe, expect, it } from "vitest";

import { patchComponentByType } from "../../../core/model/queries/components/patch";
import { createGame, type Game } from "../../../game";
import { HpComponent } from "../../model/components/mobs/HpComponent";
import { getPlayer } from "../../model/queries/player";
import { InternalActionType } from "../internal/type";
import { recordDeathTurn } from "./death";

describe("recordDeathTurn", () => {
  let game: Game;

  beforeEach(() => {
    game = createGame();
    game.dispatch({ type: InternalActionType.INIT });
  });

  it.each([
    { consumesTurn: true, expectedTurn: 18 },
    { consumesTurn: false, expectedTurn: 17 },
  ])(
    "records turn $expectedTurn when consumesTurn is $consumesTurn",
    ({ consumesTurn, expectedTurn }) => {
      game.state.turn = 17;
      patchComponentByType(getPlayer(), HpComponent, (hpComponent) => {
        hpComponent.hp = 0;
      });

      recordDeathTurn(consumesTurn);

      expect(game.state.death.turn).toBe(expectedTurn);
    },
  );
});
