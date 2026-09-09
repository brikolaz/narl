import { getComponentCreator } from "../../../../core/model/Component";

export type DefModComponentProps = {
  defMod: number;
};

export const DefModComponent = getComponentCreator<DefModComponentProps>(
  "DEF_MOD",
  { defMod: 1 },
);
