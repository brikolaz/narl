import {
  EntityRole,
  getEntityCreator,
  type Entity,
} from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { upsertRoleEntities } from "../../../../../core/model/queries/entities/add";
import { addItemToContainer } from "../../../../systems/containers/containers";
import { getRng } from "../../../../systems/rng/rng";
import { ColorComponent } from "../../../components/display/ColorComponent";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { ExplodeComponent } from "../../../components/combat/ExplodeComponent";
import { ExplodeRangeComponent } from "../../../components/combat/ExplodeRangeComponent";
import { FovComponent } from "../../../components/ai/FovComponent";
import { DmgComponent } from "../../../components/combat/DmgComponent";
import { ExpComponent } from "../../../components/state/ExpComponent";
import { HostileComponent } from "../../../components/ai/HostileComponent";
import { HpComponent } from "../../../components/combat/HpComponent";
import { MovableComponent } from "../../../components/spatial/MovableComponent";
import { PositionComponent } from "../../../components/spatial/PositionComponent";
import { UnawareComponent } from "../../../components/ai/UnawareComponent";
import type { MobFactory } from "../../../Factory";
import { ContainerEntityFactory } from "../../items/container/ContainerEntity";
import { SwordEntityFactory } from "../../items/SwordEntity";

export const BoomerEntity = getEntityCreator("BOOMER");

const addLoot = (boomer: Entity) => {
  const backpack = ContainerEntityFactory.getBackpack();
  
  if(getRng(boomer).chance(15)) {
    const longSword = SwordEntityFactory.getLongSword();
    addItemToContainer(backpack, longSword);
  }
  
  upsertRoleEntities(boomer, {
    [EntityRole.BACKPACK]: backpack,
  });
};

export const BoomerEntityFactory: MobFactory = {
  getDefault: () => {
    const boomer = BoomerEntity();

    upsertComponents(
      boomer,
      HpComponent({ hp: 5, maxHp: 5 }),
      ExpComponent({ exp: 25 }),
      GlyphComponent({ glyph: "B" }),
      NameComponent({ name: "Boomer" }),
      ColorComponent(),
      HostileComponent(),
      PositionComponent(),
      ExplodeComponent({ min: 4, max: 8 }),
      ExplodeRangeComponent({ range: boomer.rng.range(1, 2) }),
      UnawareComponent(),
      MovableComponent(),
      DmgComponent(),
      FovComponent({ range: boomer.rng.range(3, 4) })
    );
    addLoot(boomer);

    return boomer;
  },
};
