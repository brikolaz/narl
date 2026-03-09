import { useState, type PropsWithChildren } from "react"

import { GameContext } from "./context"
import { useInitialState } from "./state";

export const GameProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [gameState, setGameState] = useState(useInitialState());

    return <GameContext.Provider value={{ gameState, setGameState }}>
        {children}
    </GameContext.Provider>
}