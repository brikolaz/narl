import "./patches";
import { render } from "./game/render/render";
import { createInitialState, STATE, type GameState } from "./game/state/state";
import { dispatchGameAction } from "./game/systems/actions/gameAction/dispatchGameAction";
import type { KeyboardToActionChain } from "./game/input/keyboard/chain";
import { mapKeyboardEventToAction } from "./game/input/keyboard/mapKeyboardEventToAction";
import { InternalActionType } from "./game/systems/internal/type";
import {
  getGameViewModel,
  type GameViewModel,
} from "./game/render/getGameViewModel";
import "./game/render/index.css";
import type { GameAction } from "./game/systems/actions/types";

type Game = {
  state: GameState;
  dispatch: (action: GameAction) => void;
  view: GameViewModel;
};

const createGame = (): Game => {
  const state = createInitialState();

  return {
    state,
    dispatch(action) {
      dispatchGameAction(action);
    },
    get view() {
      return getGameViewModel();
    },
  };
};

const game = createGame();
game.dispatch({ type: InternalActionType.INIT });

render(game.view);
console.debug(STATE);

let keyboardChain: KeyboardToActionChain = undefined;
const handleKeyDown = (event: KeyboardEvent) => {
  const result = mapKeyboardEventToAction(event, keyboardChain);
  keyboardChain = result.keyboardChain;

  if (!result.action) {
    render(game.view);
    return;
  }

  event.preventDefault();

  game.dispatch(result.action);
  render(game.view);
  console.debug(STATE);
};

window.addEventListener("keydown", handleKeyDown);
