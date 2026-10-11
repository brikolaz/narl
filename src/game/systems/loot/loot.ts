import type { Entity, EntityByVariant } from "../../../core/model/Entity"
import {
  resolveEntityType,
  type EntityTypeArgument,
} from "../../../core/model/queries/entities/normalize"
import { getItemFactory } from "../../model/entities/getFactory"
import type { ContainerEntityVariants } from "../../model/entities/items/container/variants/variants"
import type { ItemEntityVariants } from "../../model/entities/items/factories"
import { addItemToContainer, getEmptySlots } from "../containers/containers"
import { getRng } from "../rng/rng"

type LootEntry = readonly [
  chance: number,
  item: EntityTypeArgument<ItemEntityVariants>,
  patcher?: (item: Entity) => void,
]

export const addContainerLoot = (
  container: EntityByVariant<ContainerEntityVariants>,
  loot: readonly LootEntry[],
): void => {
  const rng = getRng(container)
  const candidates = loot.filter(([chance]) => rng.chance(chance))
  const freeSlots = getEmptySlots(container).size
  const count = Math.min(freeSlots, candidates.length)

  for (let i = 0; i < count; i++) {
    const index = rng.range(i, candidates.length - 1)
    ;[candidates[i], candidates[index]] = [candidates[index], candidates[i]]
    const [, item, patcher] = candidates[i]
    const type = resolveEntityType(item)
    const entity = getItemFactory(type).getVariant(type)
    patcher?.(entity)
    addItemToContainer(container, entity)
  }
}
