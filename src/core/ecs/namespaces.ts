import {
  BASE_NAMESPACE,
  ECS_NAMESPACE,
  NAMESPACE_SEPARATOR,
} from "../../utils/constants";

export enum Namespace {
  COMPONENT = "COMPONENT",
  ENTITY = "ENTITY",
}

export const getEcsNamespace = (namespace: Namespace, type: string) => {
  return [
    BASE_NAMESPACE,
    ECS_NAMESPACE,
    namespace.toLowerCase(),
    type.toLowerCase(),
  ].join(NAMESPACE_SEPARATOR);
};
