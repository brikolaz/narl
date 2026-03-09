import { useContext } from "react";
import type { Renderable } from "../../../model/Renderable";
import { GameContext } from "../../../state/game/context";
import type { Unique } from "../../../model/base/Unique";

type ResolvedMap = (Renderable & Unique)[];

export const useResolvedMap = (): ResolvedMap => {
    const { gameState } = useContext(GameContext);
    const resolvedMap = [...gameState.tiles];
    resolvedMap[gameState.player.position] = gameState.player;

    return resolvedMap;
}