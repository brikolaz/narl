import { replaceEntityById } from "../../../core/ecs/queries/entities";
import { BackpackEntity } from "../../model/entities/BackpackEntity";
import { PlayerEntity } from "../../model/entities/PlayerEntity";
import type { GameState, WorldState } from "../../state/state";
import { fulfillAction, rejectAction } from "../log/action";
import type { ActionResolution } from "../turn";
import { getBackpack, isBackpackFull } from "./backpack";

export const resolvePickUpAction = (
    state: GameState,
): ActionResolution<GameState> => {
    let actionResolution: ActionResolution<GameState> = {
        nextState: state,
        consumesTurn: false,
    };
    const nextWorld: WorldState = state.world.map((tile) => {
        if (!tile.player) {
            return tile;
        }

        const nextPlayerEntity = new PlayerEntity({
            components: tile.player.components,
            entities: [...tile.player.entities],
        });
        const backpack = getBackpack(nextPlayerEntity);
        if (!backpack) {
            return tile;
        }
        if (isBackpackFull(backpack)) {
            actionResolution = rejectAction(state, "Can't pick up item. Backpack is full.", false);
            return tile;
        }
        const itemToPickUp = tile.items.at(-1);
        if (!itemToPickUp) {
            return tile;
        }
        const nextBackpack = new BackpackEntity({
            components: backpack.components,
            entities: [...backpack.entities, itemToPickUp],
        });
        replaceEntityById(nextPlayerEntity, backpack.id, nextBackpack);
        actionResolution = fulfillAction(state, "Player picked up a Sword.", true); // TODO: Add NameComponent

        return {
            floor: tile.floor,
            player: nextPlayerEntity,
            items: tile.items.slice(0, -1),
        };
    })
    actionResolution.nextState.world = nextWorld;

    return actionResolution;
}