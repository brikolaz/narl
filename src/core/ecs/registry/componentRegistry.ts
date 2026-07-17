import { COMPONENT_REGISTRY_BY_ID } from "../../../game/state/state";
import type { Component } from "../Component";
import type { Entity } from "../Entity";
import type { Id } from "../Id";

type ComponentRegistryRecord = {
  component: Component;
  parent: Entity;
};

export type ComponentRegistryById = {
  [id: Id]: ComponentRegistryRecord;
};

export const upsertComponentRegistryRecords = (
  ...records: ComponentRegistryRecord[]
) => {
  for (const record of records) {
    COMPONENT_REGISTRY_BY_ID[record.component.id] = record;
  }
};

const removeComponentRegistryRecord = (component: Id) => {
  delete COMPONENT_REGISTRY_BY_ID[component];
};

export const removeComponentRegistryRecords = (...components: Id[]) => {
  for (const id of components) {
    removeComponentRegistryRecord(id);
  }
};

export const getComponentRegistryRecord = (component: Id) => {
  return COMPONENT_REGISTRY_BY_ID[component];
};

export const patchRegistryComponent = (
  component: Id,
  patcher: (record: ComponentRegistryRecord) => ComponentRegistryRecord,
) => {
  const record = getComponentRegistryRecord(component);
  if (!record) {
    return;
  }
  COMPONENT_REGISTRY_BY_ID[component] = patcher(record);
};
