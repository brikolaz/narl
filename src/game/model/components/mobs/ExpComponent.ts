import { Component, getComponentCreator } from "../../../../core/ecs/Component";

export type ExpComponentProps = {
  exp: number;
};

export const ExpComponent = getComponentCreator<ExpComponentProps>("EXP", {
  exp: 0,
});
