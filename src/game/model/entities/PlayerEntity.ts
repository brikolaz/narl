import { EntityRole, getEntityCreator } from "../../../core/ecs/Entity";
import { addComponents } from "../../../core/ecs/queries/components/add";
import { patchComponentByType } from "../../../core/ecs/queries/components/patch";
import { addRoleEntities } from "../../../core/ecs/queries/entities/add";
import {
  DEFAULT_PLAYER_BACKPACK_SIZE,
  DEFAULT_PLAYER_GLYPH,
} from "../../../utils/constants";
import { SizeComponent } from "../components/containers/SizeComponent";
import { ColorComponent } from "../components/display/ColorComponent";
import { GlyphComponent } from "../components/display/GlyphComponent";
import { NameComponent } from "../components/display/NameComponent";
import { ExpComponent } from "../components/mobs/ExpComponent";
import { HpComponent } from "../components/mobs/HpComponent";
import type { Factory } from "../Factory";
import { AmuletSlotEntityFactory } from "./eq/slots/AmuletSlotEntity";
import { ArmorSlotEntityFactory } from "./eq/slots/ArmorSlotEntity";
import { BootsSlotEntityFactory } from "./eq/slots/BootsSlotEntity";
import { HeadSlotEntityFactory } from "./eq/slots/HeadSlotEntity";
import { MainHandSlotEntityFactory } from "./eq/slots/MainHandSlotEntity";
import { OffhandSlotEntityFactory } from "./eq/slots/OffhandSlotEntity";
import { PantsSlotEntityFactory } from "./eq/slots/PantsSlotEntity";
import { RingSlotEntityFactory } from "./eq/slots/RingSlotEntity";
import { ContainerEntityFactory } from "./items/container/ContainerEntity";

const PlayerEntity = getEntityCreator("PLAYER");

const getEq = () => {
  return [
    HeadSlotEntityFactory.getDefault(),
    AmuletSlotEntityFactory.getDefault(),
    MainHandSlotEntityFactory.getDefault(),
    ArmorSlotEntityFactory.getDefault(),
    OffhandSlotEntityFactory.getDefault(),
    RingSlotEntityFactory.getDefault(),
    PantsSlotEntityFactory.getDefault(),
    RingSlotEntityFactory.getDefault(),
    BootsSlotEntityFactory.getDefault(),
  ];
};

export const PlayerEntityFactory: Factory = {
  getDefault: () => {
    const player = PlayerEntity();

    addComponents(
      player,
      GlyphComponent({
        glyph: DEFAULT_PLAYER_GLYPH,
      }),
      ExpComponent(),
      ColorComponent(),
      NameComponent({ name: "Player" }),
      HpComponent({ hp: 20 }),
    );

    const backpack = ContainerEntityFactory.getDefault();
    patchComponentByType(backpack, SizeComponent, (component) => {
      component.size = DEFAULT_PLAYER_BACKPACK_SIZE;
    });
    addRoleEntities(player, {
      [EntityRole.EQ]: getEq(),
      [EntityRole.BACKPACK]: backpack,
    });

    return player;
  },
};
