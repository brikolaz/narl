import { Component } from "../../../../core/ecs/Component";

export type DmgModComponentProps = {
  dmgMod: number;
};

export const DmgModComponent = Component<DmgModComponentProps>("DMG_MOD", {
  dmgMod: 0,
});
