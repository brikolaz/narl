import {
  EntityRole,
  getEntityCreator,
  type Entity,
} from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { upsertRoleEntities } from "../../../../../core/model/queries/entities/add";
import {
  addItemToContainer,
  setContainerItemAt,
} from "../../../../systems/containers/containers";
import { getRng } from "../../../../systems/rng/rng";
import { ColorComponent } from "../../../components/display/ColorComponent";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { MainHandSlotComponent } from "../../../components/eq/slots/MainHandSlotComponent";
import { ExpComponent } from "../../../components/mobs/ExpComponent";
import { HostileComponent } from "../../../components/mobs/HostileComponent";
import { HpComponent } from "../../../components/mobs/HpComponent";
import { PeacefulComponent } from "../../../components/mobs/PeacefulComponent";
import { PositionComponent } from "../../../components/PositionComponent";
import { UnawareComponent } from "../../../components/UnawareComponent";
import type { MobFactory } from "../../../Factory";
import { getEqSlotByType, initEq } from "../../../queries/eq";
import { ContainerEntityFactory } from "../../items/container/ContainerEntity";
import {
  HelmetEntityFactory,
  HelmetEntityVariants,
} from "../../items/helmet/HelmetEntity";
import { SwordEntityFactory } from "../../items/SwordEntity";

export const RageBaitEntity = getEntityCreator("RAGE_BAIT");

const addLoot = (entity: Entity) => {
  const backpack = ContainerEntityFactory.getBackpack();

  if (getRng(entity).chance(100)) {
    ContainerEntityFactory.setDroppable?.(backpack);
  }
  if (getRng(entity).chance(20)) {
    addItemToContainer(backpack, SwordEntityFactory.getDefault());
  }
  if (getRng(entity).chance(100)) {
    addItemToContainer(
      backpack,
      HelmetEntityFactory.getVariant?.(HelmetEntityVariants.DEFAULT),
    );
  }

  upsertRoleEntities(entity, {
    [EntityRole.BACKPACK]: backpack,
  });
};

const addEq = (entity: Entity) => {
  initEq(entity);
  const sword = SwordEntityFactory.getDefault();
  setContainerItemAt(getEqSlotByType(entity, MainHandSlotComponent), 1, sword);
};

export const RageBaitEntityFactory: MobFactory = {
  getDefault: () => {
    const rageBait = RageBaitEntity();

    upsertComponents(
      rageBait,
      HpComponent({ hp: 10, maxHp: 10 }),
      ExpComponent({ exp: 20 }),
      GlyphComponent({
        glyph: "r",
      }),
      NameComponent({ name: "Rage Bait" }),
      ColorComponent(),
      getRng(rageBait).chance(1) ? HostileComponent() : PeacefulComponent(),
      PositionComponent(),
      UnawareComponent(),
    );
    addLoot(rageBait);
    addEq(rageBait);

    return rageBait;
  },
};
