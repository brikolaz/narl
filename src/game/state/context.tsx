import { createContext } from "react";
import type { GameState } from "./state";

export type GameContextType = {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}
export const GameContext = createContext(undefined as unknown as GameContextType) // TODO: why needed?