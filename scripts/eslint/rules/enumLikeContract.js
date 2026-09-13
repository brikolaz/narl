import {
  getEnumObject,
  getName,
  getTypeReferenceName,
  getVariableDeclarators,
} from "../ast.js"

export const enumLikeContract = {
  meta: {
    type: "problem",
    docs: { description: "Enforce the repository createEnum contract" },
    schema: [],
    messages: {
      name: "Enum value object '{{name}}' must use the `FooEnum` naming convention.",
      key: "createEnum value '{{name}}' must use UPPER_SNAKE_CASE.",
      legacy:
        "Use `createEnum(...)` instead of an `as const satisfies Enum` object.",
    },
  },
  create(context) {
    return {
      "Program:exit"(program) {
        for (const declarator of getVariableDeclarators(program)) {
          const name = getName(declarator.id)
          const object = getEnumObject(declarator.init)
          if (!name || !object) continue

          if (!/^[A-Z][a-z0-9]*(?:[A-Z][a-z0-9]*)*Enum$/.test(name)) {
            context.report({
              node: declarator.id,
              messageId: "name",
              data: { name },
            })
          }

          for (const property of object.properties) {
            const key = getName(property.key)
            if (!key || !/^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/.test(key)) {
              context.report({
                node: property.key,
                messageId: "key",
                data: { name: key ?? "<non-string>" },
              })
            }
          }
        }

        for (const declarator of getVariableDeclarators(program)) {
          if (
            declarator.init?.type === "TSSatisfiesExpression" &&
            getTypeReferenceName(declarator.init.typeAnnotation) === "Enum"
          ) {
            context.report({ node: declarator.init, messageId: "legacy" })
          }
        }
      },
    }
  },
}
