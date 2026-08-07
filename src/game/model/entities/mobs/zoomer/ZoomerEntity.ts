import { getEntityCreator } from "../../../../../core/model/Entity";
import type { MobFactory } from "../../../Factory";

export const ZoomerEntity = getEntityCreator("ZOOMER");

export const ZoomerEntityFactory: MobFactory = {
  getDefault: () => {
    const zoomer = ZoomerEntity();

    return zoomer;
  },
};
