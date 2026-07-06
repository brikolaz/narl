import type { Component } from "../../Component";
import type { Id } from "../../Id";
import { getComponentById } from "./get";

const patchDataComponentById = (
  id: Id,
  patcher: (child: Component) => void,
): void => {
  const component = getComponentById(id);
  if (!component) {
    return;
  }
  patcher(component);
};

export const patchComponentById = (
  id: Id,
  patcher: (child: Component) => void,
): void => {
  patchDataComponentById(id, patcher);
};
