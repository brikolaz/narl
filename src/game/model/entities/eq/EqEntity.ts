import { Entity, type EntityProps } from "../../../../core/ecs/Entity";

export type EqEntityProps = EntityProps;

export class EqEntity extends Entity {
  constructor(props?: EqEntityProps) {
    super(props ?? {});
  }
}
