import {
  BASE_NAMESPACE,
  ECS_NAMESPACE,
  NAMESPACE_SEPARATOR,
} from "../../utils/constants"
import { createEnum } from "../../utils/types/Enum"

export const NamespaceEnum = createEnum("COMPONENT", "ENTITY")

export const getEcsNamespace = (...segments: (string | number)[]) => {
  return [
    BASE_NAMESPACE,
    ECS_NAMESPACE,
    ...segments.map((segment) => segment.toString().toLowerCase()),
  ].join(NAMESPACE_SEPARATOR)
}
