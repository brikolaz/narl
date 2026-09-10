import type { Entity } from "../../../core/model/Entity";
import { MAP_SIZE, PURSUERS_BREAKPOINT } from "../../../utils/constants";
import { STATE } from "../../state/state";
import { getAllMobs, hasMobs } from "../mobs/mobs";
import { getPlayer } from "../player/player";
import { getPosition } from "../position/position";
import {
  canSpawnMobAt,
  getGuaranteedRandomMob,
  MobType
} from "../rng/spawnTable";
import { isTileImpassable } from "../world/tile";

const isPursuer = (entity: Entity): boolean =>
  getPosition(entity) < getPosition(getPlayer());

const getPursuers = (): Entity[] =>
  getAllMobs().filter(isPursuer);

const getValidSpawnPositions = (playerPosition: number): number[] => {
  const maxSpawnPosition = playerPosition - Math.floor(MAP_SIZE);

  return STATE.world
    .slice(0, Math.max(0, maxSpawnPosition + 1))
    .filter(
      (tile) =>
        canSpawnMobAt(tile.position, MobType.PURSUER) &&
        !hasMobs(tile) &&
        !isTileImpassable(tile.position),
    )
    .map((tile) => tile.position);
};

export const replenishPursuers = (): void => {
  const playerPosition = getPosition(getPlayer());
  const pursuers = getPursuers();
  const pursuerCount = pursuers.length;
  const pursuerTarget = Math.floor(playerPosition / PURSUERS_BREAKPOINT);
  const missingPursuers = Math.max(0, pursuerTarget - pursuerCount);
  const spawnPositions = getValidSpawnPositions(playerPosition);

  for (
    let missing = missingPursuers;
    missing > 0 && spawnPositions.length > 0;
    missing--
  ) {
    const index = STATE.rng.mobs.range(0, spawnPositions.length - 1);
    const spawnPosition = spawnPositions[index];
    spawnPositions[index] = spawnPositions.at(-1)!;
    spawnPositions.pop();

    const mob = getGuaranteedRandomMob(spawnPosition, MobType.PURSUER);
    STATE.world[spawnPosition].mobs.push(mob);
  }
};
