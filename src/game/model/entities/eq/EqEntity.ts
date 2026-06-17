import { Entity, type EntityProps } from "../../../../core/ecs/Entity";
import { HeadSlotEntity } from "./HeadSlotEntity";
import { MainHandSlotEntity } from "./MainHandSlotEntity";

export type EqEntityProps = {
  items?: Entity[];
} & EntityProps;

export class EqEntity extends Entity {
  constructor(props?: EqEntityProps) {
    const mainHandSlot = new MainHandSlotEntity();
    const headSlot = new HeadSlotEntity();

    super({
      entities: [...(props?.items ?? []), mainHandSlot, headSlot],
    });
  }
}
