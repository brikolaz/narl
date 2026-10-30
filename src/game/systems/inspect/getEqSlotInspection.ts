import type { Entity } from "../../../core/model/Entity"
import {
  getComponentByType,
  getComponentsByType,
} from "../../../core/model/queries/components/get"
import { DefComponent } from "../../model/components/combat/DefComponent"
import { DefMulComponent } from "../../model/components/combat/DefMulComponent"
import { DmgMulComponent } from "../../model/components/combat/DmgMulComponent"
import type { EntityLogProjection } from "../log/types"
import { getEntityName } from "./getEntityName"
import { getInspectDesc } from "./inspect"

export const getEqSlotInspection = (slot: Entity): EntityLogProjection => ({
  name: getEntityName(slot),
  description: getInspectDesc(slot),
  isPlayer: false,
  def: getComponentsByType(slot, DefComponent).reduce(
    (sum, component) => sum + component.def,
    0,
  ),
  slotDmgMul:
    getComponentByType(slot, DmgMulComponent)?.dmgMul ??
    DmgMulComponent.defaults.dmgMul,
  slotDefMul:
    getComponentByType(slot, DefMulComponent)?.defMul ??
    DefMulComponent.defaults.defMul,
})
