import type { Component } from "../../../core/ecs/Component";
import { type Entity } from "../../../core/ecs/Entity";
import { getComponentsByTypes } from "../../../core/ecs/queries/components/get";
import { hasComponentsByType } from "../../../core/ecs/queries/components/has";
import { AmuletComponent } from "../components/eq/AmuletComponent";
import { ArmorComponent } from "../components/eq/ArmorComponent";
import { BootsComponent } from "../components/eq/BootsComponent";
import { HeadComponent } from "../components/eq/HeadComponent";
import { MainHandComponent } from "../components/eq/MainHandComponent";
import { OffhandComponent } from "../components/eq/OffhandComponent";
import { PantsComponent } from "../components/eq/PantsComponent";
import { RemovableComponent } from "../components/eq/RemovableComponent";
import { RingComponent } from "../components/eq/RingComponent";

export const getItemSlots = (entity: Entity): Component[] => {
  return getComponentsByTypes(entity, [
    ArmorComponent,
    AmuletComponent,
    HeadComponent,
    MainHandComponent,
    OffhandComponent,
    RingComponent,
    PantsComponent,
    BootsComponent,
  ]);
};

export const isRemovable = (entity: Entity): boolean => {
  return hasComponentsByType(entity, RemovableComponent);
};
