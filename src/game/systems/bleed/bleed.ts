import { getComponentByType } from "../../../core/model/queries/components/get";
import type { EntityArgument } from "../../../core/model/queries/entities/normalize";
import { BleedComponent } from "../../model/components/BleedComponent";

export const getBleed = (entity: EntityArgument) => {
    const bleed  = getComponentByType(entity, BleedComponent);
    return bleed
}