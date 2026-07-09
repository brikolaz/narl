import { getComponentCreator } from "../../../core/ecs/Component";

type VariantComponentProps = {
  variant: symbol;
};

export const VariantComponent = getComponentCreator<VariantComponentProps>(
  "VARIANT",
  { variant: Symbol.for("VARIANT_UNDEFINED") },
);
