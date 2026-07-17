import "./patches";
import { render } from "./game/render/render";
import { getInitialState, type GameState } from "./game/state/state";
import { dispatchGameAction } from "./game/systems/actions/gameAction/dispatchGameAction";
import type { KeyboardToActionChain } from "./game/systems/input/keyboard/chain";
import { mapKeyboardEventToAction } from "./game/systems/input/keyboard/mapKeyboardEventToAction";
import { InternalActionType } from "./game/systems/internal/type";
import { getGameViewModel } from "./game/render/getGameViewModel";
import "./game/render/index.css";
import type { GameAction } from "./game/systems/actions/types";

type Game = {
  readonly state: GameState;
  dispatch: (action: GameAction) => void;
};

const createGame = (initialState: GameState = getInitialState()): Game => {
  let state = initialState;

  return {
    get state() {
      return state;
    },

    dispatch(action) {
      state = dispatchGameAction(state)(action);
    },
  };
};

const game = createGame();

game.dispatch({ type: InternalActionType.INIT });

let keyboardChain: KeyboardToActionChain = undefined;

render(getGameViewModel(game.state));
console.debug(game.state);

const handleKeyDown = (event: KeyboardEvent) => {
  const result = mapKeyboardEventToAction(event, keyboardChain, game.state);
  keyboardChain = result.keyboardChain;

  if (!result.action) {
    return;
  }

  event.preventDefault();

  game.dispatch(result.action);
  render(getGameViewModel(game.state));
  console.debug(game.state);
};

window.addEventListener("keydown", handleKeyDown);
