import { getComponentCreator } from "../../../../core/model/Component"

export type DefMulComponentProps = {
  defMul: number
}

export const DefMulComponent = getComponentCreator<DefMulComponentProps>(
  "DEF_MUL",
  { defMul: 1 },
)
