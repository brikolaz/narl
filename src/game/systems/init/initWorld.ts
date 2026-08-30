import { upsertComponents } from "../../../core/model/queries/components/add";
import { MAP_SIZE } from "../../../utils/constants";
import { getDummyArray } from "../../../utils/getDummyArray";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import { HelmetEntityFactory } from "../../model/entities/items/helmet/HelmetEntity";
import { RingEntityFactory } from "../../model/entities/items/ring/RingEntity";
import { SwordEntityFactory } from "../../model/entities/items/SwordEntity";
import { RageBaitEntityFactory } from "../../model/entities/mobs/rageBait/RageBaitEntity";
import { WallEntityFactory } from "../../model/entities/WallEntity";
import type { WorldState } from "../../state/state";
import { setPosition } from "../position/position";
import { getDefaultTile } from "../world/tile";



export const initWorld = (): WorldState => {
  const world: WorldState = getDummyArray(MAP_SIZE).map((_, position) => (getDefaultTile(position)));

  const ring = RingEntityFactory.getDefault();
  world[2].items.push(ring);
  setPosition(ring, 2);

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

  world[49] = getDefaultTile(49);
  world[49].items.push(WallEntityFactory.getDefault())
  setPosition(world[49].items[0], 49)

  return world;
};
