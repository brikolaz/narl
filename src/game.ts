import {
  getGameViewModel,
  type GameViewModel,
} from "./game/render/getGameViewModel"
import { GameStatusEnum, initState, type GameState } from "./game/state/state"
import { dispatch } from "./game/systems/actions/gameAction/dispatchGameAction"

export type Game = {
  state: GameState
  dispatch: typeof dispatch
  view: GameViewModel
  gameOver: boolean
  pendingGameOver: boolean
  win: boolean
}

export const createGame = (): Game => {
  const state = initState()

  return {
    state,
    dispatch,
    get view() {
      return getGameViewModel()
    },
    get gameOver() {
      return state.status === GameStatusEnum.GAME_OVER
    },
    get pendingGameOver() {
      return state.status === GameStatusEnum.PENDING_GAME_OVER
    },
    get win() {
      return state.status === GameStatusEnum.WIN
    },
  }
}
