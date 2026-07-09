import type { Entity } from "../../../core/ecs/Entity";
import { getDummyArray } from "../../../utils/getDummyArray";
import { Slot } from "../Slot";

type InvRowProps = {
  items: (Entity | undefined)[];
  startIndex: number;
  rowIndex: number;
  rowCount: number;
};

export const InvRow = ({ items, startIndex, rowIndex, rowCount }: InvRowProps) => {
  if (items?.length === undefined) {
    return <></>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {getDummyArray(items.length).map((_, index) => {
        const item = items[index];
        return (
          <Slot
            key={item?.id ?? `empty-${startIndex + index}`}
            item={item}
            index={startIndex + index}
            isFirstColumn={index === 0}
            isLastColumn={index === items.length - 1}
            isFirstRow={rowIndex === 0}
            isLastRow={rowIndex === rowCount - 1}
          />
        );
      })}
    </div>
  );
};
