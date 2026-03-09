import { useCallback, useContext, useEffect } from "react";
import { GameContext } from "../../../state/game/context";
import { INITIAL_PLAYER_POSITION, MAP_SIZE } from "../../../constants";

interface Movement {
    move: (event: KeyboardEvent) => void;
}

export const useMovement = (): Movement => {
    const { gameState, setGameState } = useContext(GameContext);

    const move = useCallback((event: KeyboardEvent) => {
        if (event.code == 'ArrowRight') {
            if (gameState.player.position === MAP_SIZE - 1) return;

            setGameState({
                ...gameState,
                player: {
                    ...gameState.player,
                    position: gameState.player.position + 1
                }
            })
        } else if (event.code == 'ArrowLeft') {
            if (gameState.player.position === INITIAL_PLAYER_POSITION) return;

            setGameState({
                ...gameState,
                player: {
                    ...gameState.player,
                    position: gameState.player.position - 1
                }
            })
        }
    }, [gameState, setGameState])

    useEffect(() => {
        window.addEventListener('keydown', move)

        return () => {
            window.removeEventListener("keydown", move);
        }
    }, [gameState, setGameState, move])

    return { move }
}