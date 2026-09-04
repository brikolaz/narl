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
import { ExplodeComponent } from "../../../components/ExplodeComponent";
import { ExplodeRangeComponent } from "../../../components/ExplodeRangeComponent";
import { FovComponent } from "../../../components/FovComponent";
import { DmgComponent } from "../../../components/items/DmgComponent";
import { ExpComponent } from "../../../components/mobs/ExpComponent";
import { HostileComponent } from "../../../components/mobs/HostileComponent";
import { HpComponent } from "../../../components/mobs/HpComponent";
import { MovableComponent } from "../../../components/MovableComponent";
import { PositionComponent } from "../../../components/PositionComponent";
import { UnawareComponent } from "../../../components/UnawareComponent";
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
