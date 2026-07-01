import {
  removeComponentsByType
} from "../../../../../core/ecs/queries/component";
import type { GameState } from "../../../../state/state";
import { EqSlot } from "../../../../systems/eq/types";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { getContainerItemAt } from "../../../queries/containers";
import { getEqSlot } from "../../../queries/eq";
import { getPlayerEntity } from "../../../queries/player";
import type { RingEntity } from "./RingEntity";

export class RingEntityManual {
  static shouldBeCursed(item: RingEntity, gameState: GameState): boolean {
    const pantsSlot = getEqSlot(getPlayerEntity(gameState), EqSlot.PANTS);
    return getContainerItemAt(pantsSlot, 1)?.id === item.id;
  }

  static curse(item: RingEntity) {
    removeComponentsByType(item, RemovableComponent);
  }
}
