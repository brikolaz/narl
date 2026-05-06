import { useContext, useEffect, useRef } from "react";
import { GameContext } from "../state/context";
import {
  clearBuffer,
  mapKeyboardEventToAction,
} from "../systems/input/keyboard";
import { dispatchGameAction } from "../systems/turn";

export const useKeyboardControls = () => {
  const { gameState, setGameState } = useContext(GameContext);
  const buffer = useRef<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const action = mapKeyboardEventToAction(
        event,
        buffer,
        gameState,
        setGameState,
      );

      if (action) {
        event.preventDefault();
        setGameState((state) => {
          return dispatchGameAction(action)(state);
        });
      }
    };
    const handleKeyUp = () => clearBuffer(buffer);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleKeyUp);
    };
  }, [setGameState, buffer, gameState]);
};
