import { beforeEach, describe, expect, it } from "vitest";
import { getEntityCreator } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { PierceComponent } from "../../model/components/PierceComponent";
import { initState } from "../../state/state";
import { canPierce, getPierceRange } from "./pierce";

const TestWeapon = getEntityCreator("TEST_PIERCE_WEAPON");

describe("pierce", () => {
  beforeEach(() => {
    initState();
  });

  it("can pierce when PierceComponent is present", () => {
    const weapon = TestWeapon();
    upsertComponents(weapon, PierceComponent());

    expect(canPierce(weapon)).toBe(true);
  });

  it("can't pierce when PierceComponent is missing", () => {
    const weapon = TestWeapon();

    expect(canPierce(weapon)).toBe(false);
  });

  it("returns the configured pierce range", () => {
    const weapon = TestWeapon();

    upsertComponents(weapon, PierceComponent({ pierce: 3 }));

    expect(getPierceRange(weapon)).toBe(3);
  });

  it("returns the default pierce range when PierceComponent is missing", () => {
    const weapon = TestWeapon();

    expect(getPierceRange(weapon)).toBe(1);
  });
});
