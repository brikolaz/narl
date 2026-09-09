import type { Entity } from "../../../core/model/Entity";
import { assert } from "../../../utils/assert";
import { STATE } from "../../state/state";

export const getPlayer = (): Entity => {
  return assert(STATE.player.player, "Player is not initialized");
};

export const isPlayer = (entity: Entity): boolean => {
  return entity.id === getPlayer().id;
};
