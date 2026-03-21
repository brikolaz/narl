export enum Direction {
    LEFT,
    RIGHT,
}

export type GameAction =
    | { type: "move"; direction: Direction }

export type ActionResolution<TGameState> = {
    nextState: TGameState;
    consumesTurn: boolean;
};