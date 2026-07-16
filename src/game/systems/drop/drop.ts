import type { Entity } from "../../../core/ecs/Entity";
import { removeComponentsByType } from "../../../core/ecs/queries/components/remove";
import { detachEntity } from "../../../core/ecs/queries/entities/remove";
import { PositionComponent } from "../../model/components/PositionComponent";
import { getTile } from "../../model/queries/tile";
import type { GameState } from "../../state/state";

export const dropItem = (
  gameState: GameState,
  item: Entity,
  targetPosition: number,
) => {
  const tile = getTile(gameState, targetPosition);
  detachEntity(item.id);
  removeComponentsByType(item, PositionComponent.type);
  tile.items.push(item);
};
