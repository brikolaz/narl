import { getComponentCreator } from "../../../core/model/Component";

export type ExplodeRangeComponentProps = {
  range: number;
};

export const ExplodeRangeComponent =
  getComponentCreator<ExplodeRangeComponentProps>("EXPLODE_RANGE", {
    range: 0,
  });
