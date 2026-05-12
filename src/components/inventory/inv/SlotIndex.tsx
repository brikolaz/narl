type SlotIndexProps = {
  index: number;
};

export const SlotIndex = ({ index }: SlotIndexProps) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 1,
        right: 4,
        fontSize: 8,
        color: "lightgray",
      }}
    >
      {index}
    </div>
  );
};
