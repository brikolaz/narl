import { usePlayer } from "../../../game/hooks/usePlayer";
import { INV_SLOTS_PER_ROW } from "../../../utils";
import { padArray } from "../../../utils/padArray";
import { InvRow } from "./InvRow";

export const Inv = () => {
  const { backpackSize, items } = usePlayer();

  const rows = [];

  for (let i = 0; i < backpackSize; i += INV_SLOTS_PER_ROW) {
    rows.push(
      <InvRow
        key={i}
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
