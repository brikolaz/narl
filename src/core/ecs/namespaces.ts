import {
  BASE_NAMESPACE,
  ECS_NAMESPACE,
  NAMESPACE_SEPARATOR,
} from "../../utils/constants";
import type { Enum, EnumType } from "./Enum";

export const Namespace = {
  COMPONENT: "COMPONENT",
  ENTITY: "ENTITY",
} as const as Enum;
type Namespace = EnumType<typeof Namespace>;

export const getEcsNamespace = (namespace: Namespace, type: string) => {
  return [
    BASE_NAMESPACE,
    ECS_NAMESPACE,
    namespace.toString().toLowerCase(),
    type.toLowerCase(),
  ].join(NAMESPACE_SEPARATOR);
};
