import { getComponentCreator } from "../../../../core/model/Component";

export type ExpComponentProps = {
  exp: number;
};

export const ExpComponent = getComponentCreator<ExpComponentProps>("EXP", {
  exp: 0,
});
