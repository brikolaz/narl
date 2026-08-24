import { getPlayer } from "../../model/queries/player";
import { getRng } from "../rng/rng";
import { getDeathContext } from "./death";

export const getEpitaph = () => {
  const deathContext = getDeathContext();
  const epitaphs = [
    "Health below 0",
    "Expected behaviour",
    "RNG",
    "Death, I guess",
    "Touching things you shouldn't",
    `Turn [${deathContext.turn}]`,
  ];

  return (
    epitaphs.at(getRng(getPlayer()).range(0, epitaphs.length - 1)) ??
    epitaphs[0]
  );
};
