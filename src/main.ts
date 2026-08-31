import { createGame } from "./game";
import type { KeyboardToActionChain } from "./game/input/keyboard/chain";
import { mapKeyboardEventToAction } from "./game/input/keyboard/mapKeyboardEventToAction";
import "./game/render/index.css";
import { render } from "./game/render/render";
import { STATE } from "./game/state/state";
import { InternalActionType } from "./game/systems/internal/type";
import "./patches";

const game = createGame();
game.dispatch({ type: InternalActionType.INIT });

render(game.view);
console.debug(STATE);

let keyboardChain: KeyboardToActionChain = undefined;
const handleKeyDown = (event: KeyboardEvent) => {
  event.preventDefault();

  const isGameFinished = game.gameOver || game.pendingGameOver || game.win;

  if (isGameFinished && event.repeat) {
    return;
  }

  if (isGameFinished) {
    keyboardChain = undefined;
    game.dispatch();
    render(game.view);
    return;
  }

  const result = mapKeyboardEventToAction(event, keyboardChain);
  keyboardChain = result.keyboardChain;

  game.dispatch(result.action);
  render(game.view);
  console.debug(STATE);
};

window.addEventListener("keydown", handleKeyDown);
