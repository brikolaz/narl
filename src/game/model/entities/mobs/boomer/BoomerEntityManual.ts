import type { Action } from "../../../../systems/actions/action";
import { canExplode } from "../../../../systems/explode/explode";
import { WorldActionType } from "../../../../systems/world/types";
import type { Manual } from "../../../Manual";

export const BoomerEntityManual: Manual = {
  onAttack(action, source) {
    if(canExplode(source)) {
      action.addPendingImmediateAction({
      type: WorldActionType.INIT_EXPLODE,
      entityId: source.id,
      });
    }
  },
  onDie: (action: Action, boomer) => {
    if(canExplode(boomer)) {
      action.addPendingImmediateAction({
      type: WorldActionType.INIT_EXPLODE,
      entityId: boomer.id,
      });
    }
  },
};
