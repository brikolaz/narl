import { getName, getTypeArguments } from "../ast.js"

export const entityCreatorInferenceContract = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require getEntityCreator type arguments to be inferred from its runtime type",
    },
    schema: [],
    messages: {
      inferred:
        "Do not pass type arguments to getEntityCreator(). The entity type must be inferred from its runtime type argument.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          getName(node.callee) === "getEntityCreator" &&
          getTypeArguments(node).length > 0
        ) {
          context.report({
            node: node.typeArguments ?? node.typeParameters ?? node,
            messageId: "inferred",
          })
        }
      },
    }
  },
}
