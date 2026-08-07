import type { EntityType } from "../../../../core/model/Entity";
import type { Manual } from "../../Manual";
import { RageBaitEntity } from "./rageBait/RageBaitEntity";
import { RageBaitEntityManual } from "./rageBait/RageBaitEntityManual";
import { ZoomerEntity } from "./zoomer/ZoomerEntity";
import { ZoomerEntityManual } from "./zoomer/ZoomerEntityManual";

export const MOB_MANUALS = new Map<EntityType, Manual>([
  [RageBaitEntity.type, RageBaitEntityManual],
  [ZoomerEntity.type, ZoomerEntityManual],
]);
