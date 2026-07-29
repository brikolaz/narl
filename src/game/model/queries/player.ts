import type { Entity } from "../../../core/model/Entity";
import { STATE, type PlayerState } from "../../state/state";

export const getPlayer = (): PlayerState => {
  return STATE.player;
};

export const getPlayerEntity = (): Entity => {
  return STATE.player.player;
};

export const getPlayerPosition = (): number => {
  return STATE.player.position;
};
