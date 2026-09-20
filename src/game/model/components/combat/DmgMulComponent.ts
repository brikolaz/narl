import { getComponentCreator } from "../../../../core/model/Component"

export type DmgMulComponentProps = {
  dmgMul: number
}

export const DmgMulComponent = getComponentCreator<DmgMulComponentProps>(
  "DMG_MUL",
  {
    dmgMul: 1,
  },
)
