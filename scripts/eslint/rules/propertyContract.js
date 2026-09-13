import { getName } from "../ast.js"

export const propertyContract = {
  meta: {
    type: "problem",
    docs: {
      description: "Require ordinary object properties to use strict camelCase",
    },
    schema: [],
    messages: {
      name: "Object property '{{name}}' must use strict camelCase unless it is a dictionary key for an external identifier or protocol value.",
    },
  },
  create(context) {
    const services = context.sourceCode.parserServices
    const checker = services.program?.getTypeChecker()
    const nodeMap = services.esTreeNodeToTSNodeMap

    const isDictionaryProperty = (property) => {
      if (
        !checker ||
        !nodeMap ||
        property.parent?.type !== "ObjectExpression"
      ) {
        return false
      }
      const object = nodeMap.get(property.parent)
      const contextualType = checker.getContextualType(object)
      return (
        contextualType !== undefined &&
        checker.getIndexInfosOfType(contextualType).length > 0
      )
    }

    return {
      Property(node) {
        if (node.computed && node.key.type !== "Literal") return
        const name = getName(node.key)
        if (!name) return
        if (
          node.key.type === "Literal" &&
          !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)
        ) {
          return
        }
        if (/^[a-z][a-zA-Z0-9]*$/.test(name)) return
        if (isDictionaryProperty(node)) return
        context.report({ node: node.key, messageId: "name", data: { name } })
      },
    }
  },
}
