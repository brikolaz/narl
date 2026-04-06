import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType as getEntityByTypwe } from "../../../core/ecs/queries/component";
import { getEntitiesByType, getEntityByType } from "../../../core/ecs/queries/entities";
import { SizeComponent } from "../../model/components/CapacityComponent";
import { BackpackEntity } from "../../model/entities/BackpackEntity";
import { ItemEntity } from "../../model/entities/items/ItemEntity";

export const getBackpack = (entity: Entity): BackpackEntity | undefined => {
    return getEntityByType(entity, BackpackEntity);
}

export const isBackpackFull = (backpack: BackpackEntity): boolean => {
    const itemsInBackpack = getEntitiesByType(backpack, ItemEntity)?.length ?? 0;
    const backpackSize = getEntityByTypwe(backpack, SizeComponent)?.size ?? 0;
    const backpackIsFull = itemsInBackpack === backpackSize;

    return backpackIsFull;

}