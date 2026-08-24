import type { Entity } from "../../../core/model/Entity";
import { patchComponentByType } from "../../../core/model/queries/components/patch";
import { removeById } from "../../../utils/removeById";
import { PositionComponent } from "../../model/components/PositionComponent";
import { getPosition } from "../../model/queries/position";
import { getTile } from "../../model/queries/tile";

// TODO: handle other entity kind (items etc.) movement if needed
export const move = (entity: Entity, nextPosition: number) => {
  const tile = getTile(getPosition(entity));
  removeById(tile.mobs, entity.id);
  const nextTile = getTile(nextPosition);
  nextTile.mobs.push(entity);
  patchComponentByType(entity, PositionComponent, (component) => {
    component.position = nextPosition;
  });
};
