import { getEntityCreator, type Entity } from "../../../../../core/ecs/Entity";
import { addComponents } from "../../../../../core/ecs/queries/components/add";
import type { Symbols } from "../../../../../core/ecs/Symbols";
import { ContainerComponent } from "../../../components/containers/ContainerComponent";
import { SizeComponent } from "../../../components/containers/SizeComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import { VariantComponent } from "../../../components/VariantComponent";
import type { ItemFactory } from "../../../Factory";

export const RingSlotEntity = getEntityCreator("RING_SLOT");

export const RingSlotVariants = {
  DEFAULT: Symbol("DEFAULT"),
  RING1: Symbol("RING1"),
  RING2: Symbol("RING2"),
} as const satisfies Symbols;

type RingSlotFactory = ItemFactory & {
  getRing1: () => Entity;
  getRing2: () => Entity;
};
export const RingSlotEntityFactory: RingSlotFactory = {
  getDefault: () => {
    const eqSlot = RingSlotEntity();

    addComponents(
      eqSlot,
      NameComponent({ name: "Ring" }),
      RingComponent(),
      ContainerComponent(),
      VariantComponent({ variant: RingSlotVariants.DEFAULT }),
      SizeComponent({ size: 1 }),
    );

    return eqSlot;
  },

  getRing1: () => {
    const eqSlot = RingSlotEntity();

    addComponents(
      eqSlot,
      NameComponent({ name: "Ring 1" }),
      RingComponent(),
      ContainerComponent(),
      VariantComponent({ variant: RingSlotVariants.RING1 }),
      SizeComponent({ size: 1 }),
    );

    return eqSlot;
  },

  getRing2: () => {
    const eqSlot = RingSlotEntity();

    addComponents(
      eqSlot,
      NameComponent({ name: "Ring 2" }),
      RingComponent(),
      ContainerComponent(),
      VariantComponent({ variant: RingSlotVariants.RING2 }),
      SizeComponent({ size: 1 }),
    );

    return eqSlot;
  },

  getVariant: (variant: symbol) => {
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
