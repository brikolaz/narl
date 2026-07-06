import { Component } from "../../../../core/ecs/Component";

export type HpComponentProps = {
  hp: number;
  maxHp?: number;
};

export const HpComponent = Component<HpComponentProps>("HP", {
  hp: 0,
  maxHp: 0,
});
