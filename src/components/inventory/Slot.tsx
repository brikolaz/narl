import { useItem } from "../../game/hooks/useItem";
import type { ItemEntity } from "../../game/model/entities/items/ItemEntity";
import { SlotIndex } from "./inv/SlotIndex";

interface SlotProps {
  item?: ItemEntity;
  index: number;
}

export const Slot = ({ item, index }: SlotProps) => {
  const { glyph, color } = useItem(item);

  return (
    <div
      style={{
        backgroundColor: "black",
        height: "48px",
        width: "48px",
        border: "1px solid white",
        color: color,
        position: "relative",
      }}
    >
      <SlotIndex index={index} />
      {glyph}
    </div>
  );
};
