import { getComponentCreator } from "../../../../core/model/Component";

export type DmgModComponentProps = {
  dmgMod: number;
};

export const DmgModComponent = getComponentCreator<DmgModComponentProps>("DMG_MOD", {
  dmgMod: 1,
});
