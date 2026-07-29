import {
  BASE_NAMESPACE,
  ECS_NAMESPACE,
  NAMESPACE_SEPARATOR,
} from "../../utils/constants";
import type { Enum, EnumType } from "../../utils/types/Enum";

export const Namespace = {
  COMPONENT: "COMPONENT",
  ENTITY: "ENTITY",
} as const as Enum;
type Namespace = EnumType<typeof Namespace>;

export const getEcsNamespace = (...segments: (string | number)[]) => {
  return [
    BASE_NAMESPACE,
    ECS_NAMESPACE,
    ...segments.map((segment) => segment.toString().toLowerCase()),
  ].join(NAMESPACE_SEPARATOR);
};
