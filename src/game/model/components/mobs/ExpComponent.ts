import { Component } from "../../../../core/ecs/Component";

export type ExpComponentProps = {
  exp: number;
};

export const ExpComponent = Component<ExpComponentProps>("EXP", {
  exp: 0,
});
