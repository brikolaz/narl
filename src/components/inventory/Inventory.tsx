import { usePlayer } from "../../game/hooks/usePlayer";
import { getDummyArray } from "../../utils/getDummyArray";
import { Slot } from "./Slot";

export const Inventory = () => {
  const { backpackSize, items } = usePlayer();
  
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {getDummyArray(backpackSize).map((_, index) => {
        const item = items[index];
        console.log(item)
        return <Slot key={item?.id ?? `empty-${index}`} item={item} />;
      })}
    </div>
  );
};
