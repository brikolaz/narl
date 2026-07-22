import "./patches";
import { render } from "./game/render/render";
import { createInitialState, STATE, type GameState } from "./game/state/state";
import { dispatchGameAction } from "./game/systems/actions/gameAction/dispatchGameAction";
import type { KeyboardToActionChain } from "./game/systems/input/keyboard/chain";
import { mapKeyboardEventToAction } from "./game/systems/input/keyboard/mapKeyboardEventToAction";
import { InternalActionType } from "./game/systems/internal/type";
import { getGameViewModel } from "./game/render/getGameViewModel";
import "./game/render/index.css";
import type { GameAction } from "./game/systems/actions/types";

type Game = {
  state: GameState;
  dispatch: (action: GameAction) => void;
};

const createGame = (): Game => {
  const state = createInitialState();

  return {
    state,
    dispatch(action) {
      dispatchGameAction(action);
    },
  };
};

const game = createGame();

game.dispatch({ type: InternalActionType.INIT });

let keyboardChain: KeyboardToActionChain = undefined;

render(getGameViewModel());
console.debug(STATE);

const handleKeyDown = (event: KeyboardEvent) => {
  const result = mapKeyboardEventToAction(event, keyboardChain);
  keyboardChain = result.keyboardChain;

  if (!result.action) {
    return;
  }

  event.preventDefault();

  game.dispatch(result.action);
  render(getGameViewModel());
  console.debug(STATE);
};

window.addEventListener("keydown", handleKeyDown);
