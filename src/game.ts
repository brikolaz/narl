import { getGameViewModel, type GameViewModel } from "./game/render/getGameViewModel";
import { GAME_STATUS, initState, STATE, type GameState } from "./game/state/state";
import { dispatch } from "./game/systems/actions/gameAction/dispatchGameAction";

export type Game = {
    state: GameState;
    dispatch: typeof dispatch;
    view: GameViewModel;
    gameOver: boolean;
    pendingGameOver: boolean;
    win: boolean;
};

export const createGame = (): Game => {
    initState()
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
        get win() {
            return state.status === GAME_STATUS.WIN;
        },
    };
};