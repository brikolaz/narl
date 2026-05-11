import { useItem } from "../../game/hooks/useItem";
import type { ItemEntity } from "../../game/model/entities/items/ItemEntity";

interface SlotProps {
  item?: ItemEntity;
}

export const Slot = ({ item }: SlotProps) => {
  const { glyph, color } = useItem(item);

  return (
    <div
      style={{
        backgroundColor: "black",
        height: "48px",
        width: "48px",
        border: "1px solid white",
        color: color,
      }}
    >
      {glyph ?? " "}
    </div>
  );
};
