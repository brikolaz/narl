import { beforeEach, describe, expect, it } from "vitest";
import { MOBS_RNG_NAMESPACE } from "../../../utils/constants";
import { initState, STATE } from "../../state/state";
import { dispatch } from "../actions/gameAction/dispatchGameAction";
import { InternalActionType } from "../internal/type";
import { Random } from "./random";

describe("world RNG", () => {
  beforeEach(() => {
    initState();
  });

  it("uses and preserves the seed known before game initialization", () => {
    const initialSeed = STATE.seed;
    const expected = new Random({
      seed: initialSeed,
      namespace: MOBS_RNG_NAMESPACE,
    });

    dispatch({ type: InternalActionType.INIT });

    expect(STATE.seed).toBe(initialSeed);
    expect(STATE.rng.mobs.random()).toBe(expected.random());
  });
});
