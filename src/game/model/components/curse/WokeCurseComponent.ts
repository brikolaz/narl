import { getComponentCreator } from "../../../../core/model/Component"

type WokeCurseComponentProps = { chance: number }

export const WokeCurseComponent = getComponentCreator<WokeCurseComponentProps>(
  "WOKE_CURSE",
  { chance: 0 },
)
