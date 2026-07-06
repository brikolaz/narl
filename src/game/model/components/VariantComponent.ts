import { Component } from "../../../core/ecs/Component";

type VariantComponentProps = {
  variant: symbol;
};

export const VariantComponent = Component<VariantComponentProps>(
  "VARIANT",
  { variant: Symbol.for("VARIANT_UNDEFINED") },
);
