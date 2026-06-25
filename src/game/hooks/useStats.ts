import { useContext } from "react";
import { GameContext } from "../state/context";
import { getPlayerEntity } from "../model/queries/player";
import { getEqStats } from "../systems/stats/eqStats";
import { getPlayerStats } from "../systems/stats/playerStats";

export const useStats = () => {
  const { gameState } = useContext(GameContext);

  const eqStats = getEqStats(getPlayerEntity(gameState));
  const playerStats = getPlayerStats(getPlayerEntity(gameState));

  return { eqStats, playerStats };
};
