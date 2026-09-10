import type { Entity } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { patchComponentByType } from "../../../core/model/queries/components/patch";
import { removeComponentsByType } from "../../../core/model/queries/components/remove";
import { FovComponent } from "../../model/components/ai/FovComponent";
import {
  Hostility,
  HostilityComponent,
} from "../../model/components/ai/HostilityComponent";
import { UnawareComponent } from "../../model/components/ai/UnawareComponent";
import { DroppableComponent } from "../../model/components/interaction/DroppableComponent";
import { MovableComponent } from "../../model/components/spatial/MovableComponent";
import { ExpComponent } from "../../model/components/state/ExpComponent";
import { clearContainer, getBackpack } from "../containers/containers";
import { isMovable } from "../mobAi/move";

const makeBackpackNonDroppable = (mob: Entity): void => {
  const backpack = getBackpack(mob);
  if (!backpack) {
    return;
  }

  removeComponentsByType(backpack, DroppableComponent);
  clearContainer(backpack);
};

export const makePursuer = (mob: Entity): void => {
  removeComponentsByType(mob, UnawareComponent);
  removeComponentsByType(mob, ExpComponent);
  makeBackpackNonDroppable(mob);

  if (getComponentByType(mob, FovComponent)) {
    patchComponentByType(mob, FovComponent, (fov) => {
      fov.range = Infinity;
    });
  } else {
    upsertComponents(mob, FovComponent({ range: Infinity }));
  }

  patchComponentByType(
    mob,
    HostilityComponent,
    (component) => {
      component.hostility = Hostility.HOSTILE
    }
  );
  if (!isMovable(mob)) {
    upsertComponents(mob, MovableComponent());
  }
};
