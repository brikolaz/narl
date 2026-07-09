import type { EntityType } from "../../../../core/ecs/Entity";
import type { Manual } from "../../Manual";
import { RageBaitEntity } from "./rageBait/RageBaitEntity";
import { RageBaitEntityManual } from "./rageBait/RageBaitEntityManual";

export const MOB_MANUALS = new Map<EntityType, Manual>([
  [RageBaitEntity.type, RageBaitEntityManual],
]);
