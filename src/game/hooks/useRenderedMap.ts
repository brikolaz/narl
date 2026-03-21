import { useContext, useMemo } from "react";
import { GameContext } from "../state/context";
import { getRenderedMap } from "../systems/render";

export const useRenderedMap = () => {
    const { gameState } = useContext(GameContext);

    return useMemo(() => {
        return getRenderedMap(gameState);
    }, [gameState]);
}