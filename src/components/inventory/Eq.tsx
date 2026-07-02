import { usePlayer } from "../../game/hooks/usePlayer";
import { EqSlot } from "../../game/systems/eq/types";
import { EqRow } from "./EqRow";
import { PlaceholderSlot } from "./PlaceholderSlot";
import { Slot } from "./Slot";

export const EQ = () => {
  const {
    eq: { getItem },
  } = usePlayer();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <EqRow>
        <PlaceholderSlot
          isFirstRow={true}
          isLastRow={false}
          isFirstColumn={true}
          isLastColumn={false}
        />
        <Slot
          index={1}
          isFirstRow={true}
          isLastRow={false}
          isFirstColumn={false}
          isLastColumn={false}
          item={getItem(EqSlot.HEAD)}
        />
        <Slot
          index={2}
          isFirstRow={true}
          isLastRow={false}
          isFirstColumn={false}
          isLastColumn={true}
          item={getItem(EqSlot.AMULET)}
        />
      </EqRow>
      <EqRow>
        <Slot
          index={3}
          isFirstRow={false}
          isLastRow={false}
          isFirstColumn={true}
          isLastColumn={false}
          item={getItem(EqSlot.MAIN_HAND)}
        />
        <Slot
          index={4}
          isFirstRow={false}
          isLastRow={false}
          isFirstColumn={false}
          isLastColumn={false}
          item={getItem(EqSlot.ARMOR)}
        />
        <Slot
          index={5}
          isFirstRow={true}
          isLastRow={false}
          isFirstColumn={false}
          isLastColumn={true}
          item={getItem(EqSlot.OFFHAND)}
        />
      </EqRow>
      <EqRow>
        <Slot
          index={6}
          isFirstRow={false}
          isLastRow={false}
          isFirstColumn={true}
          isLastColumn={false}
          item={getItem(EqSlot.RING1)}
        />
        <Slot
          index={7}
          isFirstRow={false}
          isLastRow={false}
          isFirstColumn={false}
          isLastColumn={false}
          item={getItem(EqSlot.PANTS)}
        />
        <Slot
          index={8}
          isFirstRow={false}
          isLastRow={false}
          isFirstColumn={false}
          isLastColumn={false}
          item={getItem(EqSlot.RING2)}
        />
      </EqRow>
      <EqRow>
        <PlaceholderSlot
          isFirstRow={false}
          isLastRow={true}
          isFirstColumn={true}
          isLastColumn={false}
        />
        <Slot
          index={9}
          isFirstRow={false}
          isLastRow={true}
          isFirstColumn={false}
          isLastColumn={false}
          item={getItem(EqSlot.BOOTS)}
        />
        <PlaceholderSlot
          isFirstRow={false}
          isLastRow={true}
          isFirstColumn={false}
          isLastColumn={true}
        />
      </EqRow>
    </div>
  );
};
