import { cloneDeep } from "lodash";
import { getComponentByType, removeComponentsByType } from "../../../core/ecs/queries/component";
import { getEntitiesByType, getEntityByType } from "../../../core/ecs/queries/entities";
import { DEFAULT_BACKPACK_SIZE, INITIAL_PLAYER_POSITION } from "../../../utils/constants";
import { SizeComponent } from "../../model/components/CapacityComponent";
import { PositionComponent } from "../../model/components/PositionComponent";
import { BackpackEntity } from "../../model/entities/BackpackEntity";
import { ItemEntity } from "../../model/entities/items/ItemEntity";
import type { GameState } from "../../state/state";
import { addLog } from "../log/addLog";
import type { ActionResolution } from "../turn";

export function resolvePickUpAction(
    state: GameState,
): ActionResolution<GameState> {
    const defaultActionResolution = {
        nextState: state,
        consumesTurn: false,
    };
    const nextPlayerEntity = cloneDeep(state.world.player);
    const playerRenderableComponent = getComponentByType(nextPlayerEntity, PositionComponent);
    if (!playerRenderableComponent) {
        return defaultActionResolution
    }
    const playerPosition = playerRenderableComponent.position ?? INITIAL_PLAYER_POSITION;
    const playerBackpack = getEntityByType(nextPlayerEntity, BackpackEntity);

    if (!playerBackpack) {
        return defaultActionResolution;
    }

    const itemsInBackpack = getEntitiesByType(playerBackpack, ItemEntity)?.length ?? 0;
    const backpackSize = getComponentByType(playerBackpack, SizeComponent)?.size ?? DEFAULT_BACKPACK_SIZE;
    const backpackIsFull = itemsInBackpack === backpackSize;

    if (backpackIsFull) {
        const nextState = addLog(state, {
            message: "Can't pick up item. Backpack is full.",
            turn: state.turn
        });

        return {
            nextState,
            consumesTurn: false,
        };
    }

    let nextItems = cloneDeep(state.world.items);
    let itemToPickUp: ItemEntity | undefined = undefined;

    for (let i = nextItems.length - 1; i >= 0; i--) {
        const item = nextItems[i];
        const itemPositionComponent = getComponentByType(item, PositionComponent);
        if (playerPosition === itemPositionComponent?.position) {
            itemToPickUp = cloneDeep(item);
            nextItems = nextItems.filter((_, index) => index !== i);
            break;
        }
    }
    if (!itemToPickUp) {
        return defaultActionResolution;
    }
    removeComponentsByType(itemToPickUp, PositionComponent);
    playerBackpack.entities.push(itemToPickUp);

    const nextState = addLog({
        ...state,
        world: {
            ...state.world,
            player: nextPlayerEntity,
            items: nextItems,
        }
    }, {
        message: "Player picked up a Sword.", // TODO: Add NameComponent
        turn: state.turn
    });

    return {
        nextState,
        consumesTurn: true,
    };
}