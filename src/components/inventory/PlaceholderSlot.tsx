type PlaceholderSlotProps = {
  isFirstColumn?: boolean;
  isLastColumn?: boolean;
  isFirstRow?: boolean;
  isLastRow?: boolean;
};

const OUTER_BORDER_COLOR = "black";
const INNER_BORDER_COLOR = "#a0a0a0";
const INNER_BORDER_STYLE = "solid";

export const PlaceholderSlot = ({
  isFirstColumn = true,
  isLastColumn = true,
  isFirstRow = true,
  isLastRow = true,
}: PlaceholderSlotProps) => {
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
        borderBottom: isLastRow ? `1px solid ${OUTER_BORDER_COLOR}` : undefined,
        borderLeft: isFirstColumn
          ? `1px solid ${OUTER_BORDER_COLOR}`
          : undefined,
      }}
    ></div>
  );
};
