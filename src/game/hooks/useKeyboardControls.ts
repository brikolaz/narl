import { useContext, useEffect } from "react";
import { GameContext } from "../state/context";
import { dispatchGameAction } from "../systems/turn";
import { mapKeyboardEventToAction } from "../systems/input/keyboard";

export function useKeyboardControls() {
    const { setGameState } = useContext(GameContext);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const action = mapKeyboardEventToAction(event);

            if (action) {
                event.preventDefault();
                setGameState((state) => {
                    console.log(dispatchGameAction(action)(state));
                    return dispatchGameAction(action)(state);
                });
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [setGameState]);
}