import { useState, type PropsWithChildren } from "react"

import { GameContext } from "./context"
import { getInitialState } from "./state";

export const GameProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [gameState, setGameState] = useState(getInitialState());

    return <GameContext.Provider value={{ gameState, setGameState }}>
        {children}
    </GameContext.Provider>
}