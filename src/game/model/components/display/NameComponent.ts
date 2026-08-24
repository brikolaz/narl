import { getComponentCreator } from "../../../../core/model/Component";

export type NameComponentProps = {
  name: string;
};

export const NameComponent = getComponentCreator<NameComponentProps>("NAME", {
  name: "???",
});
