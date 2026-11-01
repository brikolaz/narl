import type { Id } from "../model/Id"

export const removeById = <Item extends { id: Id }>(arr: Item[], id: Id) => {
  const index = arr.findIndex((el) => el.id === id)
  if (index !== -1) {
    arr.splice(index, 1)
  }
}
