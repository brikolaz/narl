import type { Entity } from "../../core/model/Entity"
import { makePursuer } from "../systems/pursuer/makePursuer"
import type { MobFactory } from "./Factory"

export abstract class BaseMobFactory implements MobFactory {
  abstract getDefault(): Entity

  getPursuer(): Entity {
    const entity = this.getDefault()
    makePursuer(entity)
    return entity
  }
}
