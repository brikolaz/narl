import { getName, unwrapExpression } from "../ast.js"

const PREDICATE_PREFIX = /^(?:is|has|can|should)[A-Z]/

export const predicateContract = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce boolean predicate prefixes and return types",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowedBooleanNames: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      booleanName:
        "Boolean function '{{name}}' must start with is, has, can, or should.",
      predicateReturn:
        "Predicate '{{name}}' must always return boolean, not '{{actual}}'.",
    },
  },
  create(context) {
    const services = context.sourceCode.parserServices
    const checker = services.program?.getTypeChecker()
    const nodeMap = services.esTreeNodeToTSNodeMap
    if (!checker || !nodeMap) return {}
    const allowed = new Set(context.options[0]?.allowedBooleanNames ?? [])

    const check = (nameNode, functionNode) => {
      const name = getName(nameNode)
      if (!name) return
      const tsNode = nodeMap.get(functionNode)
      const signature = checker.getSignatureFromDeclaration(tsNode)
      if (!signature) return
      const returnType = checker.getReturnTypeOfSignature(signature)
      const returnName = checker.typeToString(returnType)
      const isBoolean = returnName === "boolean"
      const isPredicate = PREDICATE_PREFIX.test(name)
      if (isPredicate && !isBoolean) {
        context.report({
          node: nameNode,
          messageId: "predicateReturn",
          data: { name, actual: returnName },
        })
      } else if (isBoolean && !isPredicate && !allowed.has(name)) {
        context.report({
          node: nameNode,
          messageId: "booleanName",
          data: { name },
        })
      }
    }

    return {
      FunctionDeclaration(node) {
        check(node.id, node)
      },
      VariableDeclarator(node) {
        const value = unwrapExpression(node.init)
        if (
          ["ArrowFunctionExpression", "FunctionExpression"].includes(
            value?.type,
          )
        ) {
          check(node.id, value)
        }
      },
      MethodDefinition(node) {
        if (node.kind === "get") return
        check(node.key, node.value)
      },
      Property(node) {
        if (node.kind === "get") return
        const value = unwrapExpression(node.value)
        if (
          ["ArrowFunctionExpression", "FunctionExpression"].includes(
            value?.type,
          )
        ) {
          check(node.key, value)
        }
      },
      PropertyDefinition(node) {
        const value = unwrapExpression(node.value)
        if (
          ["ArrowFunctionExpression", "FunctionExpression"].includes(
            value?.type,
          )
        ) {
          check(node.key, value)
        }
      },
      TSMethodSignature(node) {
        check(node.key, node)
      },
      TSPropertySignature(node) {
        const type = node.typeAnnotation?.typeAnnotation
        if (type?.type === "TSFunctionType") check(node.key, type)
      },
    }
  },
}
