import {
  EntityRole,
  getEntityCreator,
  type Entity,
} from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { upsertRoleEntities } from "../../../../../core/model/queries/entities/add";
import { setContainerItemAt } from "../../../../systems/containers/containers";
import { ColorComponent } from "../../../components/display/ColorComponent";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { MainHandSlotComponent } from "../../../components/eq/slots/MainHandSlotComponent";
import { FovComponent } from "../../../components/FovComponent";
import { ExpComponent } from "../../../components/mobs/ExpComponent";
import { HostileComponent } from "../../../components/mobs/HostileComponent";
import { HpComponent } from "../../../components/mobs/HpComponent";
import { MovableComponent } from "../../../components/MovableComponent";
import { PositionComponent } from "../../../components/PositionComponent";
import { UnawareComponent } from "../../../components/UnawareComponent";
import type { MobFactory } from "../../../Factory";
import { getEqSlotByType, initEq } from "../../../queries/eq";
import { ContainerEntityFactory } from "../../items/container/ContainerEntity";
import { SwordEntityFactory } from "../../items/SwordEntity";

export const ZoomerEntity = getEntityCreator("ZOOMER");

const addLoot = (entity: Entity) => {
  const backpack = ContainerEntityFactory.getBackpack();

  upsertRoleEntities(entity, {
    [EntityRole.BACKPACK]: backpack,
  });
};

const addEq = (entity: Entity) => {
  initEq(entity);
  const sword = SwordEntityFactory.getDefault();
  setContainerItemAt(getEqSlotByType(entity, MainHandSlotComponent), 1, sword);
};

export const ZoomerEntityFactory: MobFactory = {
  getDefault: () => {
    const zoomer = ZoomerEntity();

    upsertComponents(
      zoomer,
      HpComponent({ hp: 10, maxHp: 10 }),
      ExpComponent({ exp: 50 }),
      GlyphComponent({
        glyph: "z",
      }),
      NameComponent({ name: "Zoomer" }),
      ColorComponent(),
      HostileComponent(),
      MovableComponent(),
      PositionComponent(),
      UnawareComponent(),
      FovComponent({ range: zoomer.rng.range(5, 7) }),
    );
    addEq(zoomer);
    addLoot(zoomer);

    return zoomer;
  },
};
