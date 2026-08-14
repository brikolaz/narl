import { getComponentCreator } from "../../../../core/model/Component";

export type DmgComponentProps = {
  min: number;
  max: number;
};

export const DmgComponent = getComponentCreator<DmgComponentProps>("DMG", {
  min: 0,
  max: 0,
});
