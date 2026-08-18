import type { KeyboardToActionChain } from "./game/input/keyboard/chain";
import { mapKeyboardEventToAction } from "./game/input/keyboard/mapKeyboardEventToAction";
import {
  getGameViewModel,
  type GameViewModel,
} from "./game/render/getGameViewModel";
import "./game/render/index.css";
import { render } from "./game/render/render";
import { GAME_STATUS, STATE, type GameState } from "./game/state/state";
import { dispatch } from "./game/systems/actions/gameAction/dispatchGameAction";
import { InternalActionType } from "./game/systems/internal/type";
import "./patches";

type Game = {
  state: GameState;
  dispatch: typeof dispatch;
  view: GameViewModel;
  gameOver: boolean;
  pendingGameOver: boolean;
};

const createGame = (): Game => {
  const state = STATE;

  return {
    state,
    dispatch,
    get view() {
      return getGameViewModel();
    },
    get gameOver() {
      return state.status === GAME_STATUS.GAME_OVER;
    },
    get pendingGameOver() {
      return state.status === GAME_STATUS.PENDING_GAME_OVER;
    },
  };
};

const game = createGame();
game.dispatch({ type: InternalActionType.INIT });

render(game.view);
console.debug(STATE);

let keyboardChain: KeyboardToActionChain = undefined;
const handleKeyDown = (event: KeyboardEvent) => {
  event.preventDefault();

  if (
    game.gameOver || game.pendingGameOver
  ) {
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
