import { getInitialState } from "./game/state/state";
import { dispatchGameAction } from "./game/systems/actions/gameAction/dispatchGameAction";
import type { KeyboardToActionChain } from "./game/systems/input/keyboard/chain";
import { mapKeyboardEventToAction } from "./game/systems/input/keyboard/mapKeyboardEventToAction";
import { InternalActionType } from "./game/systems/internal/type";
import "./index.css";

let state = dispatchGameAction({ type: InternalActionType.INIT })(
  getInitialState(),
);
console.log(state);
const keyboardChain: KeyboardToActionChain = undefined;

const handleKeyDown = (event: KeyboardEvent) => {
  const action = mapKeyboardEventToAction(event, keyboardChain, state);

  if (!action) {
    return;
  }

  event.preventDefault();

  state = dispatchGameAction(action)(state);

  console.log(state);
};

window.addEventListener("keydown", handleKeyDown);
