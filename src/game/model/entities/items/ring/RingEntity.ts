import {
  EntityRole,
  getEntityCreator,
  type Entity,
} from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { upsertRoleEntities } from "../../../../../core/model/queries/entities/add";
import { getRng } from "../../../../systems/rng/rng";
import { GlyphComponent } from "../../../components/display/GlyphComponent";
import { NameComponent } from "../../../components/display/NameComponent";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import { DmgModComponent } from "../../../components/items/DmgModComponent";
import { DroppableComponent } from "../../../components/items/DroppableComponent";
import { PickupableComponent } from "../../../components/items/PickupableComponent";
import type { ItemFactory } from "../../../Factory";
import { BonusStatsEntityFactory } from "../../BonusStatsEntity";

export const RingEntity = getEntityCreator("RING");

const addBonusStats = (entity: Entity) => {
  const bonusStats = BonusStatsEntityFactory.getDefault();

  upsertComponents(
    bonusStats,
    DmgModComponent({ dmgMod: getRng(entity).pick(1.5, 2) ?? DmgModComponent.defaults.dmgMod }),
  );
  upsertRoleEntities(entity, {
    [EntityRole.BONUS_STATS]: bonusStats,
  });
}

export const RingEntityFactory: ItemFactory = {
  getDefault: () => {
    const ring = RingEntity();

    upsertComponents(
      ring,
      GlyphComponent({ glyph: "o" }),
      NameComponent({ name: "Ring" }),
      RemovableComponent(),
      RingComponent(),
      PantsComponent(),
      PickupableComponent(),
      DroppableComponent(),
    );

    addBonusStats(ring)
    return ring;
  },
};
