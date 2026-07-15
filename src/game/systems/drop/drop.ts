import type { Entity } from "../../../core/ecs/Entity";
import { removeComponentsByType } from "../../../core/ecs/queries/components/remove";
import { detachRegistryEntity } from "../../../core/ecs/registry/entityRegistry";
import { PositionComponent } from "../../model/components/PositionComponent";
import { getTile } from "../../model/queries/tile";
import type { GameState } from "../../state/state";

export const dropItem = (
  gameState: GameState,
  item: Entity,
  targetPosition: number,
) => {
  const tile = getTile(gameState, targetPosition);
  detachRegistryEntity(item.id);
  removeComponentsByType(item, PositionComponent.type);
  tile.items.push(item);
};
