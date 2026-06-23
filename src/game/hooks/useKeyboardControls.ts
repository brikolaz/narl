import { useContext, useEffect, useRef } from "react";
import { GameContext } from "../state/context";
import { dispatchGameAction } from "../systems/actions/gameAction/dispatchGameAction";
import { mapKeyboardEventToAction } from "../systems/input/keyboard/mapKeyboardEventToAction";
import type { KeyboardToActionChain } from "../systems/input/keyboard/chain";

export const useKeyboardControls = () => {
  const { gameState, setGameState } = useContext(GameContext);
  const keyboardChain = useRef<KeyboardToActionChain>(undefined);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const action = mapKeyboardEventToAction(event, keyboardChain, gameState);

      if (action) {
        event.preventDefault();
        setGameState((state) => {
          return dispatchGameAction(action)(state);
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setGameState, gameState]);
};
