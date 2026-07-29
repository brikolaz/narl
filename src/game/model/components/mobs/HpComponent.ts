import { getComponentCreator } from "../../../../core/model/Component";

export type HpComponentProps = {
  hp: number;
  maxHp?: number;
};

export const HpComponent = getComponentCreator<HpComponentProps>("HP", {
  hp: 0,
  maxHp: 0,
});
