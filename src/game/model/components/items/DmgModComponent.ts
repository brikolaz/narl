import { getComponentCreator } from "../../../../core/ecs/Component";

export type DmgModComponentProps = {
  dmgMod: number;
};

export const DmgModComponent = getComponentCreator<DmgModComponentProps>("DMG_MOD", {
  dmgMod: 1,
});
