import { beforeEach, describe, expect, it } from "vitest";
import {
  EntityRole,
  getEntityCreator,
  type Entity,
} from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { upsertRoleEntities } from "../../../core/model/queries/entities/add";
import { getEntitiesByRole } from "../../../core/model/queries/entities/get";
import { PantsSlotComponent } from "../../model/components/eq/slots/PantsSlotComponent";
import { ArmorSlotComponent } from "../../model/components/eq/slots/ArmorSlotComponent";
import { MainHandSlotComponent } from "../../model/components/eq/slots/MainHandSlotComponent";
import { DmgComponent } from "../../model/components/items/DmgComponent";
import { DmgModComponent } from "../../model/components/items/DmgModComponent";
import { BonusStatsEntityFactory } from "../../model/entities/BonusStatsEntity";
import { RingEntityFactory } from "../../model/entities/items/ring/RingEntity";
import { getEqSlotByType, initEq } from "../../model/queries/eq";
import { initState } from "../../state/state";
import { getAttackDmgRange, rollAttackDmg } from "../attack/dmg";
import { setContainerItemAt } from "../containers/containers";
import { getBonusStats } from "./bonusStats";

const TestEntity = getEntityCreator("TEST_ATTACK_DMG");

const createArmor = (dmg: number, dmgMod: number): Entity => {
  const armor = TestEntity();
  const bonusStats = BonusStatsEntityFactory.getDefault();
  upsertComponents(
    bonusStats,
    DmgComponent({ min: dmg, max: dmg }),
    DmgModComponent({ dmgMod }),
  );
  upsertRoleEntities(armor, {
    [EntityRole.BONUS_STATS]: bonusStats,
  });
  return armor;
};

describe("attack damage", () => {
  beforeEach(() => {
    initState();
  });

  it("adds armor damage before multiplying all armor damage modifiers", () => {
    const source = TestEntity();
    const weapon = TestEntity();
    const armor = createArmor(2, 1.5);
    const ring = createArmor(3, 2);
    initEq(source);
    upsertComponents(weapon, DmgComponent({ min: 10, max: 10 }));

    setContainerItemAt(
      getEqSlotByType(source, MainHandSlotComponent),
      1,
      weapon,
    );
    setContainerItemAt(
      getEqSlotByType(source, ArmorSlotComponent),
      1,
      armor,
    );
    setContainerItemAt(
      getEqSlotByType(source, PantsSlotComponent),
      1,
      ring,
    );

    expect(getAttackDmgRange(source)).toEqual({ min: 30, max: 30 });
    expect(rollAttackDmg(source)).toBe(30);
  });

  it("returns default damage when the entity has no attack weapon", () => {
    const source = TestEntity();
    initEq(source);

    expect(getAttackDmgRange(source)).toEqual(DmgComponent.defaults);
  });

  it("stores the ring damage modifier in its bonus stats entity", () => {
    const ring = RingEntityFactory.getDefault();
    const bonusStats = getBonusStats(ring);

    expect(getEntitiesByRole(ring, EntityRole.BONUS_STATS)).toEqual([
      bonusStats,
    ]);
    expect(getEntitiesByRole(ring, EntityRole.DEFAULT)).toEqual([]);
    expect(getComponentByType(ring, DmgModComponent)).toBeUndefined();
    expect(getComponentByType(bonusStats, DmgModComponent)?.dmgMod).toBeOneOf([
      1.5,
      2,
    ]);
  });
});
