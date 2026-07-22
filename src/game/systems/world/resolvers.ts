import type { ActionResolution } from "../actions/types";
import { resolveWorldAttackAction } from "../attack/resolveWorldAttackAction";
import { resolveCurseItemAction } from "../effects/curse/resolveWorldCurseItemAction";
import { resolveWorldDropItemAction } from "../drop/resolveWorldDropItemAction";
import { resolveGainExpAction } from "../exp/resolveGainExpAction";
import { resolveKillEntityAction } from "./resolveKillEntityAction";
import { resolveRemoveEntityAction } from "./resolveRemoveEntityAction";
import { WorldActionType } from "./types";

export type AnyWorldResolver = (action: any) => ActionResolution;

export const worldActionResolvers = {
  [WorldActionType.DROP_ITEM]: resolveWorldDropItemAction,
  [WorldActionType.GAIN_EXP]: resolveGainExpAction,
  [WorldActionType.KILL]: resolveKillEntityAction,
  [WorldActionType.REMOVE_ENTITY]: resolveRemoveEntityAction,
  [WorldActionType.ATTACK]: resolveWorldAttackAction,
} satisfies Record<WorldActionType, AnyWorldResolver>;
