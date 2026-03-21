import { cloneDeep } from "lodash";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { INITIAL_PLAYER_POSITION } from "../../../utils/constants";
import type { GameState } from "../../state/state";
import type { ActionResolution, Direction } from "../turn";
import { getNextPlayerPosition } from "./getNextPlayerPosition";
import { PositionComponent } from "../../model/components/PositionComponent";

export function resolveMoveAction(
    state: GameState,
    direction: Direction
): ActionResolution<GameState> {
    const defaultActionResolution = {
        nextState: state,
        consumesTurn: false,
    };

    const playerRenderableComponent = getComponentByType(state.player, PositionComponent);
    if (!playerRenderableComponent) {
        return defaultActionResolution
    }
    const currentPosition = playerRenderableComponent.position ?? INITIAL_PLAYER_POSITION;

    const nextPosition = getNextPlayerPosition({
        currentPosition,
        direction,
        tilesCount: state.tiles.length,
    });

    if (nextPosition === null) {
        return defaultActionResolution;
    }

    const nextPlayerEntity = cloneDeep(state.player);
    const nextPositionComponent = getComponentByType(nextPlayerEntity, PositionComponent);
    if (nextPositionComponent) {
        nextPositionComponent.position = nextPosition;
    }

    return {
        nextState: {
            ...state,
            player: nextPlayerEntity,
        },
        consumesTurn: true,
    };
}