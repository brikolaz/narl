import { getComponentCreator } from "../../../core/model/Component"

type BlockComponentProps = {
  def: number
}

export const BlockComponent = getComponentCreator<BlockComponentProps>(
  "BLOCK",
  { def: 0 },
)
