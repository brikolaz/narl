import { STATE } from "../../../game/state/state";
import type { Component } from "../Component";
import type { Entity } from "../Entity";
import type { Id } from "../Id";

type ComponentRegistryRecord<Props extends object | undefined = object> = {
  component: Component<Props>;
  parent: Entity;
};

export type ComponentRegistryById = {
  [id: Id]: ComponentRegistryRecord;
};

export const upsertComponentRegistryRecords = (
  ...records: ComponentRegistryRecord[]
) => {
  for (const record of records) {
    STATE.componentRegistryById[record.component.id] = record;
  }
};

const removeComponentRegistryRecord = (component: Id) => {
  delete STATE.componentRegistryById[component];
};

export const removeComponentRegistryRecords = (...components: Id[]) => {
  for (const id of components) {
    removeComponentRegistryRecord(id);
  }
};

export const getComponentRegistryRecord = (component: Id) => {
  return STATE.componentRegistryById[component];
};

export const patchRegistryComponent = (
  component: Id,
  patcher: (record: ComponentRegistryRecord) => ComponentRegistryRecord,
) => {
  const record = getComponentRegistryRecord(component);
  if (!record) {
    return;
  }
  STATE.componentRegistryById[component] = patcher(record);
};
