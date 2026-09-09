import type { Component } from "../../../core/model/Component";
import { type Entity } from "../../../core/model/Entity";
import { getComponentsByTypes } from "../../../core/model/queries/components/get";
import { hasComponentsByType } from "../../../core/model/queries/components/has";
import { ChestComponent } from "../components/equipment/ChestComponent";
import { BootsComponent } from "../components/equipment/BootsComponent";
import { HeadComponent } from "../components/equipment/HeadComponent";
import { MainHandComponent } from "../components/equipment/MainHandComponent";
import { OffhandComponent } from "../components/equipment/OffhandComponent";
import { PantsComponent } from "../components/equipment/PantsComponent";
import { RemovableComponent } from "../components/equipment/RemovableComponent";

export const getItemSlots = (entity: Entity): Component[] => {
  return getComponentsByTypes(entity, [
    ChestComponent,
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
