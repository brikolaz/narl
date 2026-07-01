import { MAP_SIZE } from "../../../utils/constants";
import { getDummyArray } from "../../../utils/getDummyArray";
import { VisitedComponent } from "../../model/components/VisitedComponent";
import { FloorEntity } from "../../model/entities/FloorEntity";
import { HornedHelmetEntityFactory } from "../../model/entities/items/helmet/HelmetEntityFactory";
import { RingEntityFactory } from "../../model/entities/items/ring/RingEntityFactory";
import {
  SwordEntityFactory
} from "../../model/entities/items/SwordEntity";
import { RageBaitEntityFactory } from "../../model/entities/mobs/rageBait/RageBaitEntityFactory";
import type { WorldState } from "../../state/state";

export const initWorld = (): WorldState => {
  const world: WorldState = getDummyArray(MAP_SIZE).map((_, position) => ({
    floor: new FloorEntity(),
    player: undefined,
    items: [],
    mobs: [],
    position,
  }));
  world[3].items.push(RingEntityFactory.getDefault());
  world[3].items.push(SwordEntityFactory.getDefault());
  world[4].items.push(HornedHelmetEntityFactory.getHornedHelmet());
  world[0].floor.components.push(new VisitedComponent());
  world[5].mobs.push(RageBaitEntityFactory.getDefault());
  world[6].mobs.push(RageBaitEntityFactory.getDefault());
  world[7].mobs.push(RageBaitEntityFactory.getDefault());
  
  return world;
};
