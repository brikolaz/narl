import { actionContract } from "./rules/actionContract.js"
import { ecsComponentContract } from "./rules/ecsComponentContract.js"
import { ecsEntityContract } from "./rules/ecsEntityContract.js"
import { entityCreatorInferenceContract } from "./rules/entityCreatorInferenceContract.js"
import { enumLikeContract } from "./rules/enumLikeContract.js"
import { moduleConstantContract } from "./rules/moduleConstantContract.js"
import { predicateContract } from "./rules/predicateContract.js"
import { propertyContract } from "./rules/propertyContract.js"
import { underscoreContract } from "./rules/underscoreContract.js"

export default {
  rules: {
    "action-contract": actionContract,
    "ecs-component-contract": ecsComponentContract,
    "ecs-entity-contract": ecsEntityContract,
    "entity-creator-inference-contract": entityCreatorInferenceContract,
    "enum-like-contract": enumLikeContract,
    "module-constant-contract": moduleConstantContract,
    "predicate-contract": predicateContract,
    "property-contract": propertyContract,
    "underscore-contract": underscoreContract,
  },
}
