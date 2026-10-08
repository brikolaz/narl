import { getComponentCreator } from "../../../../core/model/Component"

type OffensiveContainerCurseComponentProps = {
  minDmg: number
  maxDmg: number
  dmgMul: number
  defToDmgMul: number
}
export const OffensiveContainerCurseComponent =
  getComponentCreator<OffensiveContainerCurseComponentProps>(
    "OFFENSIVE_CONTAINER_CURSE",
    {
      minDmg: 0,
      maxDmg: 0,
      dmgMul: 1,
      defToDmgMul: 1,
    },
  )
