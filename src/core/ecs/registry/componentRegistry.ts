import type { Component } from "../Component";
import type { Id } from "../Id";

type ComponentRegistryRecord = {
  component: Component;
  parent: Id;
};
type ComponentRegistryById = {
  [id: Id]: ComponentRegistryRecord;
};

export const COMPONENT_REGISTRY_BY_ID: ComponentRegistryById = {};

export const setComponentRegistryRecords = (
  ...records: ComponentRegistryRecord[]
) => {
  for (const record of records) {
    COMPONENT_REGISTRY_BY_ID[record.component.id] = record;
  }
};

const removeComponentRegistryRecordById = (id: Id) => {
  delete COMPONENT_REGISTRY_BY_ID[id];
};

export const removeComponentRegistryRecordsById = (...ids: Id[]) => {
  for (const id of ids) {
    removeComponentRegistryRecordById(id);
  }
};

export const getComponentRegistryRecordById = (id: Id) => {
  return COMPONENT_REGISTRY_BY_ID[id];
};

export const patchRegistryComponentById = (
  id: Id,
  patcher: (record: ComponentRegistryRecord) => ComponentRegistryRecord,
) => {
  const record = getComponentRegistryRecordById(id);
  if (!record) {
    return;
  }
  COMPONENT_REGISTRY_BY_ID[id] = patcher(record);
};
