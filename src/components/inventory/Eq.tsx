import { usePlayer } from "../../game/hooks/usePlayer";
import { EqStats } from "../EqStats";
import { Slot } from "./Slot";

export const EQ = () => {
  const {
    eq: { eqSlots, getItemInSlot },
  } = usePlayer();

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {eqSlots.map((slot, index) => {
        const item = getItemInSlot(slot);
        return (
          <Slot
            key={slot?.id ?? `empty-${index}`}
            item={item}
            index={index + 1}
            isFirstColumn={index === 0}
            isLastColumn={index === eqSlots.length - 1}
          />
        );
      })}
      <div
        style={{
          marginLeft: 16,
        }}
      >
        <EqStats />
      </div>
    </div>
  );
};
