import type { Entity } from "../../../core/model/Entity";
import { STATE } from "../../state/state";

export const getPlayer = (): Entity => {
  return STATE.player.player;
};
