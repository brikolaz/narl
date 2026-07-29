import { getComponentCreator } from "../../../../core/model/Component";

export type DmgComponentProps = {
  dmg: number;
};

export const DmgComponent = getComponentCreator<DmgComponentProps>("DMG", { dmg: 0 });
