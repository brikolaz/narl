import { upsertComponents } from "../../../core/model/queries/components/add";
import { MAP_SIZE } from "../../../utils/constants";
import { getDummyArray } from "../../../utils/getDummyArray";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import { FloorEntityFactory } from "../../model/entities/FloorEntity";
import { HelmetEntityFactory } from "../../model/entities/items/helmet/HelmetEntity";
import { RingEntityFactory } from "../../model/entities/items/ring/RingEntity";
import { SwordEntityFactory } from "../../model/entities/items/SwordEntity";
import { RageBaitEntityFactory } from "../../model/entities/mobs/rageBait/RageBaitEntity";
import type { WorldState } from "../../state/state";
import { setPosition } from "../position/position";

export const initWorld = (): WorldState => {
  const world: WorldState = getDummyArray(MAP_SIZE).map((_, position) => ({
    floor: FloorEntityFactory.getDefault(),
    player: undefined,
    items: [],
    mobs: [],
    position,
  }));

  const ring = RingEntityFactory.getDefault();
  world[3].items.push(ring);
  setPosition(ring, 3);

  const sword = SwordEntityFactory.getDefault();
  world[3].items.push(sword);
  setPosition(sword, 3);

  const hornedHelmet = HelmetEntityFactory.getHornedHelmet();
  world[4].items.push(hornedHelmet);
  setPosition(hornedHelmet, 4);

  world[5].mobs.push(RageBaitEntityFactory.getDefault());
  setPosition(world[5].mobs[0], 5);
  world[6].mobs.push(RageBaitEntityFactory.getDefault());
  setPosition(world[6].mobs[0], 6);

  world[7].mobs.push(RageBaitEntityFactory.getDefault());
  setPosition(world[7].mobs[0], 7);

  upsertComponents(world[0].floor, VisitedComponent());

  return world;
};
