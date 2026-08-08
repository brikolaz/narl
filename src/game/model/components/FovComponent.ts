import { getComponentCreator } from "../../../core/model/Component";

type FovComponentProps = {
  range: number;
};
export const FovComponent = getComponentCreator<FovComponentProps>("FOV", {
  range: 1,
});
