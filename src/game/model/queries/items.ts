import type { Component } from "../../../core/model/Component";
import { type Entity } from "../../../core/model/Entity";
import { getComponentsByTypes } from "../../../core/model/queries/components/get";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { ArmorComponent } from "../components/eq/ArmorComponent";
import { BootsComponent } from "../components/eq/BootsComponent";
import { HeadComponent } from "../components/eq/HeadComponent";
import { MainHandComponent } from "../components/eq/MainHandComponent";
import { OffhandComponent } from "../components/eq/OffhandComponent";
import { PantsComponent } from "../components/eq/PantsComponent";
import { RemovableComponent } from "../components/eq/RemovableComponent";

export const getItemSlots = (entity: Entity): Component[] => {
  return getComponentsByTypes(entity, [
    ArmorComponent,
    HeadComponent,
    MainHandComponent,
    OffhandComponent,
    PantsComponent,
    BootsComponent,
  ]);
};

export const isRemovable = (entity: Entity): boolean => {
  return hasComponentsByType(entity, RemovableComponent);
};
