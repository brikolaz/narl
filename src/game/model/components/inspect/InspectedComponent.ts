import { getComponentCreator } from "../../../../core/model/Component";

type InspectedComponentProps = {
  times: number;
};

export const InspectedComponent = getComponentCreator<InspectedComponentProps>(
  "INSPECTED",
  { times: 0 },
);
