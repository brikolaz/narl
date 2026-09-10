import type { Entity } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { patchComponentByType } from "../../../core/model/queries/components/patch";
import { removeComponentsByType } from "../../../core/model/queries/components/remove";
import { MAP_SIZE, PURSUERS_BREAKPOINT } from "../../../utils/constants";
import { FovComponent } from "../../model/components/ai/FovComponent";
import { HostileComponent } from "../../model/components/ai/HostileComponent";
import { PeacefulComponent } from "../../model/components/ai/PeacefulComponent";
import { UnawareComponent } from "../../model/components/ai/UnawareComponent";
import { DroppableComponent } from "../../model/components/interaction/DroppableComponent";
import { MovableComponent } from "../../model/components/spatial/MovableComponent";
import { ExpComponent } from "../../model/components/state/ExpComponent";
import { STATE } from "../../state/state";
import { isHostile } from "../attack/hostililty";
import { clearContainer, getBackpack } from "../containers/containers";
import { isMovable } from "../mobAi/move";
import { getAllMobs, hasMobs } from "../mobs/mobs";
import { getPlayer } from "../player/player";
import { getPosition } from "../position/position";
import {
  canSpawnMobAt,
  getGuaranteedRandomMob
} from "../rng/spawnTable";
import { isTileImpassable } from "../world/tile";

const isPursuer = (entity: Entity): boolean =>
  getPosition(entity) < getPosition(getPlayer());

const getPursuers = (): Entity[] =>
  getAllMobs().filter(isPursuer);

const makeBackpackNonDroppable = (mob: Entity): void => {
  const backpack = getBackpack(mob);
  if (!backpack) {
    return;
  }

  removeComponentsByType(backpack, DroppableComponent);
  clearContainer(backpack);
};

const makePursuer = (mob: Entity): void => {
  removeComponentsByType(mob, PeacefulComponent, UnawareComponent);
  removeComponentsByType(mob, ExpComponent);
  makeBackpackNonDroppable(mob);

  if (getComponentByType(mob, FovComponent)) {
    patchComponentByType(mob, FovComponent, (fov) => {
      fov.range = Infinity;
    });
  } else {
    upsertComponents(mob, FovComponent({ range: Infinity }));
  }

  if (!isHostile(mob)) {
    upsertComponents(mob, HostileComponent());
  }
  if (!isMovable(mob)) {
    upsertComponents(mob, MovableComponent());
  }
};

const getValidSpawnPositions = (playerPosition: number): number[] => {
  const maxSpawnPosition = playerPosition - Math.floor(MAP_SIZE);

  return STATE.world
    .slice(0, Math.max(0, maxSpawnPosition + 1))
    .filter(
      (tile) =>
        canSpawnMobAt(tile.position) &&
        !hasMobs(tile) &&
        !isTileImpassable(tile.position),
    )
    .map((tile) => tile.position);
};

export const replenishPursuers = (): void => {
  const playerPosition = getPosition(getPlayer());
  const pursuers = getPursuers();
  pursuers.forEach(makePursuer);
  const pursuerCount = pursuers.length;
  const pursuerTarget = Math.max(
    pursuerCount,
    Math.floor(playerPosition / PURSUERS_BREAKPOINT),
  );
  const spawnPositions = getValidSpawnPositions(playerPosition);

  for (
    let missing = pursuerTarget - pursuerCount;
    missing > 0 && spawnPositions.length > 0;
    missing--
  ) {
    const index = STATE.rng.mobs.range(0, spawnPositions.length - 1);
    const spawnPosition = spawnPositions[index];
    spawnPositions[index] = spawnPositions.at(-1)!;
    spawnPositions.pop();

    const mob = getGuaranteedRandomMob(spawnPosition);

    makePursuer(mob);
    STATE.world[spawnPosition].mobs.push(mob);
  }
};
