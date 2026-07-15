import { getInitialState } from "./game/state/state";
import { dispatchGameAction } from "./game/systems/actions/gameAction/dispatchGameAction";
import type { KeyboardToActionChain } from "./game/systems/input/keyboard/chain";
import { mapKeyboardEventToAction } from "./game/systems/input/keyboard/mapKeyboardEventToAction";
import { InternalActionType } from "./game/systems/internal/type";
import { getGameViewModel } from "./game/view/getGameViewModel";
import "./index.css";
import { render } from "./render";

let state = dispatchGameAction({ type: InternalActionType.INIT })(
  getInitialState(),
);
let keyboardChain: KeyboardToActionChain = undefined;

render(getGameViewModel(state));
console.log(state);
const handleKeyDown = (event: KeyboardEvent) => {
  const result = mapKeyboardEventToAction(event, keyboardChain, state);
  keyboardChain = result.keyboardChain;

  if (!result.action) {
    return;
  }

  event.preventDefault();

  state = dispatchGameAction(result.action)(state);
  render(getGameViewModel(state));
  console.log(state);
};

window.addEventListener("keydown", handleKeyDown);
