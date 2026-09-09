import {
  EntityRole,
  getEntityCreator,
  type Entity,
} from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { patchComponentByType } from "../../../../../core/model/queries/components/patch";
import { upsertRoleEntities } from "../../../../../core/model/queries/entities/add";
import {
  addItemToContainer,
  setContainerItemAt,
} from "../../../../systems/containers/containers";
import { getRng } from "../../../../systems/rng/rng";
import { ColorComponent } from "../../../components/display/ColorComponent";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { MainHandSlotComponent } from "../../../components/equipment/slots/MainHandSlotComponent";
import { ExpComponent } from "../../../components/state/ExpComponent";
import { HostileComponent } from "../../../components/ai/HostileComponent";
import { HpComponent } from "../../../components/combat/HpComponent";
import { PeacefulComponent } from "../../../components/ai/PeacefulComponent";
import { PositionComponent } from "../../../components/spatial/PositionComponent";
import { UnawareComponent } from "../../../components/ai/UnawareComponent";
import type { MobFactory } from "../../../Factory";
import { getEqSlotByType, initEq } from "../../../queries/eq";
import { DmgComponent } from "../../../components/combat/DmgComponent";
import { ContainerEntityFactory } from "../../items/container/ContainerEntity";
import {
  HelmetEntityFactory,
  HelmetEntityVariants,
} from "../../items/helmet/HelmetEntity";
import { SwordEntityFactory } from "../../items/SwordEntity";

export const RageBaitEntity = getEntityCreator("RAGE_BAIT");

const addLoot = (entity: Entity) => {
  const backpack = ContainerEntityFactory.getBackpack();

  if (getRng(entity).chance(5)) {
    ContainerEntityFactory.setDroppable?.(backpack);
  }
  if (getRng(entity).chance(20)) {
    addItemToContainer(backpack, SwordEntityFactory.getDefault());
  }
  if (getRng(entity).chance(20)) {
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
  patchComponentByType(sword, DmgComponent, (dmg) => {
    dmg.min = 1;
    dmg.max = 3;
  });
};

export const RageBaitEntityFactory: MobFactory = {
  getDefault: () => {
    const rageBait = RageBaitEntity();

    upsertComponents(
      rageBait,
      HpComponent({ hp: 10, maxHp: 10 }),
      ExpComponent({ exp: 20 }),
      GlyphComponent({
        glyph: "R",
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
