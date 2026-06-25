import type { Entity } from "../../../core/ecs/Entity";
import { getComponentByType } from "../../../core/ecs/queries/component";
import type { Tile } from "../../state/state";
import { NameComponent } from "../components/display/NameComponent";

export const hasMobs = (tile: Tile) => {
  return tile.mobs.length > 0;
};

export const getMob = (tile: Tile) => {
  return tile.mobs[0];
};

export const getMobById = (tile: Tile, id: string) => {
  return tile.mobs.find((mob) => mob.id === id);
};

export const getMobPosition = (tile: Tile) => {
  return tile.mobs[0];
};

export const getMobName = (mob: Entity) => {
  const name = getComponentByType(mob, NameComponent)?.name;
  return name;
};
