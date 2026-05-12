import type { ItemEntity } from "../../../game";
import { getDummyArray } from "../../../utils/getDummyArray";
import { Slot } from "../Slot";

type InvRowProps = {
  items: (ItemEntity | undefined)[];
  startIndex: number;
};

export const InvRow = ({ items, startIndex }: InvRowProps) => {
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
          />
        );
      })}
    </div>
  );
};
