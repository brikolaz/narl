import { getEntityCreator, type Entity } from "../../../../../core/ecs/Entity";
import type { Enum, EnumType } from "../../../../../core/ecs/Enum";
import { upsertComponents } from "../../../../../core/ecs/queries/components/add";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import type { ItemFactory } from "../../../Factory";

export const RingSlotEntity = getEntityCreator("RING_SLOT");

export const RingSlotVariants = {
  DEFAULT: "DEFAULT",
  RING1: "RING1",
  RING2: "RING2",
} as const satisfies Enum;
type RingSlotVariants = EnumType<typeof RingSlotVariants>;

type RingSlotFactory = ItemFactory & {
  getRing1: () => Entity;
  getRing2: () => Entity;
};
export const RingSlotEntityFactory: RingSlotFactory = {
  getDefault: () => {
    const eqSlot = RingSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Ring" }),
      RingComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
    );

    return eqSlot;
  },

  getRing1: () => {
    const eqSlot = RingSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Ring 1" }),
      RingComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
    );

    return eqSlot;
  },

  getRing2: () => {
    const eqSlot = RingSlotEntity();

    upsertComponents(
      eqSlot,
      NameComponent({ name: "Ring 2" }),
      RingComponent(),
      ContainerComponent(),
      SizeComponent({ size: 1 }),
    );

    return eqSlot;
  },

  getVariant: (variant: RingSlotVariants) => {
    switch (variant) {
      case RingSlotVariants.RING1:
        return RingSlotEntityFactory.getRing1();
      case RingSlotVariants.RING2:
        return RingSlotEntityFactory.getRing2();
      default:
        return RingSlotEntityFactory.getDefault();
    }
  },
};
