import { usePlayer } from "../../../game/hooks/usePlayer";
import { INV_SLOTS_PER_ROW } from "../../../utils";
import { padArray } from "../../../utils/padArray";
import { InvRow } from "./InvRow";

export const Inv = () => {
  const { backpackSize, items } = usePlayer();
  const size = backpackSize ?? 0;

  const rows = [];

  const rowCount = Math.ceil(size / INV_SLOTS_PER_ROW);

  for (let i = 0; i < size; i += INV_SLOTS_PER_ROW) {
    rows.push(
      <InvRow
        key={i}
        rowIndex={i / INV_SLOTS_PER_ROW}
        rowCount={rowCount}
        startIndex={i + 1}
        items={padArray(
          items.slice(i, i + INV_SLOTS_PER_ROW),
          INV_SLOTS_PER_ROW,
        )}
      />,
    );
  }

  return <div style={{ display: "flex", flexDirection: "column" }}>{rows}</div>;
};
