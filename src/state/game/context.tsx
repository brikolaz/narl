import { createContext } from "react";
import type { Game } from "./state";

export type GameContextType = {
    gameState: Game;
    setGameState: (gameState: Game) => void;
}
export const GameContext = createContext(undefined as unknown as GameContextType) // TODO: why needed?