import { getComponentCreator } from "../../../../core/model/Component"

type AssableCurseComponentProps = {
  inspectedTimes: number
}
export const AssableCurseComponent =
  getComponentCreator<AssableCurseComponentProps>("ASSABLE_CURSE", {
    inspectedTimes: 0,
  })
