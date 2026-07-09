import {
  EntityRole,
  getEntityCreator,
  type Entity,
} from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import {
  addRoleEntities
} from "../../../../../core/ecs/queries/entities/add";
import { EqSlot } from "../../../../systems/eq/types";
import {
  addItemToContainer,
  setContainerItemAt,
} from "../../../../systems/inv/containers";
import { RNG } from "../../../../systems/rng/rng";
import { ColorComponent } from "../../../components/display/ColorComponent";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { ExpComponent } from "../../../components/mobs/ExpComponent";
import { HostileComponent } from "../../../components/mobs/HostileComponent";
import { HpComponent } from "../../../components/mobs/HpComponent";
import { PeacefulComponent } from "../../../components/mobs/PeacefulComponent";
import type { MobFactory } from "../../../Factory";
import { AmuletSlotEntityFactory } from "../../eq/slots/AmuletSlotEntity";
import { ArmorSlotEntityFactory } from "../../eq/slots/ArmorSlotEntity";
import { BootsSlotEntityFactory } from "../../eq/slots/BootsSlotEntity";
import {
  HeadSlotEntityFactory
} from "../../eq/slots/HeadSlotEntity";
import { MainHandSlotEntityFactory } from "../../eq/slots/MainHandSlotEntity";
import { OffhandSlotEntityFactory } from "../../eq/slots/OffhandSlotEntity";
import { PantsSlotEntityFactory } from "../../eq/slots/PantsSlotEntity";
import { RingSlotEntityFactory } from "../../eq/slots/RingSlotEntity";
import { ContainerEntityFactory } from "../../items/container/ContainerEntity";
import {
  HelmetEntityFactory,
  HelmetEntityVariants,
} from "../../items/helmet/HelmetEntity";
import { SwordEntityFactory } from "../../items/SwordEntity";

export const RageBaitEntity = getEntityCreator("RAGE_BAIT");

const addLoot = (entity: Entity) => {
  const backpack = ContainerEntityFactory.getBackpack();
  if (RNG.items.chance(5)) {
    ContainerEntityFactory.setDroppable?.(backpack);
  }
  if (RNG.items.chance(20)) {
    addItemToContainer(backpack, SwordEntityFactory.getDefault());
  }
  if (RNG.items.chance(50)) {
    addItemToContainer(
      backpack,
      HelmetEntityFactory.getVariant?.(HelmetEntityVariants.HELMET),
    );
  }
  addRoleEntities(entity, {
    [EntityRole.BACKPACK]: backpack,
  });
};

// TODO: refactor EQ system
const addEq = (entity: Entity) => {
  addRoleEntities(entity, {
    [EntityRole.EQ]: [
      HeadSlotEntityFactory.getDefault(),
      AmuletSlotEntityFactory.getDefault(),
      MainHandSlotEntityFactory.getDefault(),
      ArmorSlotEntityFactory.getDefault(),
      OffhandSlotEntityFactory.getDefault(),
      RingSlotEntityFactory.getDefault(),
      PantsSlotEntityFactory.getDefault(),
      RingSlotEntityFactory.getDefault(),
      BootsSlotEntityFactory.getDefault(),
    ],
  });
  const sword = SwordEntityFactory.getDefault();
  setContainerItemAt(entity, EqSlot.MAIN_HAND, sword);
};

export const RageBaitEntityFactory: MobFactory = {
  getDefault: () => {
    const rageBait = RageBaitEntity();

    addComponents(
      rageBait,
      HpComponent({ hp: 10 }),
      ExpComponent({ exp: 20 }),
      GlyphComponent({
        glyph: "r",
      }),
      NameComponent({ name: "Rage Bait" }),
      ColorComponent(),
      RNG.mobs.chance(1) ? HostileComponent() : PeacefulComponent(),
    );
    addLoot(rageBait);
    addEq(rageBait);

    return rageBait;
  },
};
