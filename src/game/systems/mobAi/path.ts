import type { Entity } from "../../../core/model/Entity";
import { getPosition } from "../../model/queries/position";
import { getVisibleTiles } from "../player/getVisibleTiles";

export const hasPath = (
  source: Entity | undefined,
  target: Entity | undefined,
) => {
  if (source === undefined || target === undefined) {
    return false;
  }
  const sourcePosition = getPosition(source);
  const targetPosition = getPosition(target);

  const min = Math.min(sourcePosition, targetPosition);
  const max = Math.max(sourcePosition, targetPosition);

  return getVisibleTiles()
    .filter((tile) => {
      const position = tile.position;
      return position > min && position < max;
    })
    .every((tile) => tile.mobs.length === 0);
};
