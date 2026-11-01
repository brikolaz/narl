import { getComponentCreator } from "../../../../core/model/Component"
import { COLORS } from "../../../../core/utils/colors"

export type ColorComponentProps = {
  color: string
}

export const ColorComponent = getComponentCreator<ColorComponentProps>(
  "COLOR",
  {
    color: COLORS.default,
  },
)
