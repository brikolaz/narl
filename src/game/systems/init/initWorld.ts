import { addComponents } from "../../../core/ecs/queries/components/add";
import { MAP_SIZE } from "../../../utils/constants";
import { getDummyArray } from "../../../utils/getDummyArray";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import { FloorEntityFactory } from "../../model/entities/FloorEntity";
import { HornedHelmetEntityFactory } from "../../model/entities/items/helmet/HelmetEntityFactory";
import { RingEntityFactory } from "../../model/entities/items/ring/RingEntity";
import { SwordEntityFactory } from "../../model/entities/items/SwordEntity";
import { RageBaitEntityFactory } from "../../model/entities/mobs/rageBait/RageBaitEntityFactory";
import type { WorldState } from "../../state/state";

export const initWorld = (): WorldState => {
  const world: WorldState = getDummyArray(MAP_SIZE).map((_, position) => ({
    floor: FloorEntityFactory.getDefault(),
    player: undefined,
    items: [],
    mobs: [],
    position,
  }));
  world[3].items.push(RingEntityFactory.getDefault());
  world[3].items.push(SwordEntityFactory.getDefault());
  world[4].items.push(HornedHelmetEntityFactory.getHornedHelmet());
  addComponents(world[0].floor, VisitedComponent());
  world[5].mobs.push(RageBaitEntityFactory.getDefault());
  world[6].mobs.push(RageBaitEntityFactory.getDefault());
  world[7].mobs.push(RageBaitEntityFactory.getDefault());

  return world;
};
