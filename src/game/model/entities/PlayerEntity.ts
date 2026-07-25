import { EntityRole, getEntityCreator } from "../../../core/ecs/Entity";
import { upsertComponents } from "../../../core/ecs/queries/components/add";
import { upsertRoleEntities } from "../../../core/ecs/queries/entities/add";
import { DEFAULT_PLAYER_GLYPH } from "../../../utils/constants";
import { ColorComponent } from "../components/display/ColorComponent";
import { GlyphComponent } from "../components/display/GlyphComponent";
import { NameComponent } from "../components/display/NameComponent";
import { ExpComponent } from "../components/mobs/ExpComponent";
import { HpComponent } from "../components/mobs/HpComponent";
import type { Factory } from "../Factory";
import { initEq } from "../queries/eq";
import { ContainerEntityFactory } from "./items/container/ContainerEntity";

const PlayerEntity = getEntityCreator("PLAYER");

export const PlayerEntityFactory: Factory = {
  getDefault: () => {
    const player = PlayerEntity();

    upsertComponents(
      player,
      GlyphComponent({
        glyph: DEFAULT_PLAYER_GLYPH,
      }),
      ExpComponent(),
      ColorComponent(),
      NameComponent({ name: "Player" }),
      HpComponent({ hp: 20, maxHp: 20 }),
    );

    const backpack = ContainerEntityFactory.getPlayerBackpack();
    initEq(player);
    upsertRoleEntities(player, {
      [EntityRole.BACKPACK]: backpack,
    });

    return player;
  },
};
