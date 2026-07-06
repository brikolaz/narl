import { Component } from "../../../../core/ecs/Component";

export type DmgComponentProps = {
  dmg: number;
};

export const DmgComponent = Component<DmgComponentProps>("DMG", { dmg: 0 });
