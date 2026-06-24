import { useItem } from "../../game/hooks/useItem";
import type { ItemEntity } from "../../game/model/entities/items/ItemEntity";
import { SlotIndex } from "./inv/SlotIndex";

interface SlotProps {
  item?: ItemEntity;
  index: number;
  isFirstColumn?: boolean;
  isLastColumn?: boolean;
  isFirstRow?: boolean;
  isLastRow?: boolean;
}

const OUTER_BORDER_COLOR = "gray";
const INNER_BORDER_COLOR = "#a0a0a0";
const INNER_BORDER_STYLE = "solid";

export const Slot = ({
  item,
  index,
  isFirstColumn = true,
  isLastColumn = true,
  isFirstRow = true,
  isLastRow = true,
}: SlotProps) => {
  const { glyph, color } = useItem(item);

  return (
    <div
      style={{
        backgroundColor: "black",
        height: "48px",
        width: "48px",
        boxSizing: "border-box",
        borderTop: isFirstRow
          ? `1px solid ${OUTER_BORDER_COLOR}`
          : `1px ${INNER_BORDER_STYLE} ${INNER_BORDER_COLOR}`,
        borderRight: isLastColumn
          ? `1px solid ${OUTER_BORDER_COLOR}`
          : `1px ${INNER_BORDER_STYLE} ${INNER_BORDER_COLOR}`,
        borderBottom: isLastRow
          ? `1px solid ${OUTER_BORDER_COLOR}`
          : undefined,
        borderLeft: isFirstColumn
          ? `1px solid ${OUTER_BORDER_COLOR}`
          : undefined,
        color: color,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SlotIndex index={index} />
      {glyph}
    </div>
  );
};
