import path from "node:path"
import { getName, unwrapExpression } from "../ast.js"
import { toCamelCase, toConstantCase } from "../names.js"

const hasAncestorNamed = (node, expectedName) => {
  let current = node.parent
  while (current) {
    if (
      ["Property", "MethodDefinition", "PropertyDefinition"].includes(
        current.type,
      ) &&
      getName(current.key) === expectedName
    ) {
      return true
    }
    current = current.parent
  }
  return false
}

export const ecsEntityContract = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce entity filenames, creators, factories, manuals, and runtime types",
    },
    schema: [],
    messages: {
      filename:
        "Entity declaration '{{name}}' must be declared in '{{expected}}'.",
      declaration: "Entity file '{{file}}' must declare '{{expected}}'.",
      literal: "{{name}} must use runtime type '{{expected}}'.",
      manual: "Entity manual file '{{file}}' must declare '{{expected}}'.",
      variants: "Entity variants '{{actual}}' must be named '{{expected}}'.",
      instance: "The default {{entity}} instance must be named '{{expected}}'.",
    },
  },
  create(context) {
    const filename = context.filename.replaceAll(path.sep, "/")
    if (
      !filename.includes("/src/game/model/entities/") ||
      !filename.endsWith(".ts")
    ) {
      return {}
    }
    const basename = path.basename(filename, ".ts")
    const isManual = basename.endsWith("EntityManual")
    const isEntity = basename.endsWith("Entity")
    const isVariantEntity = filename.includes("/variants/")

    const declarators = []
    return {
      VariableDeclarator(node) {
        declarators.push(node)
      },
      "Program:exit"(program) {
        if (!isManual && !isEntity) {
          for (const declarator of declarators) {
            const name = getName(declarator.id)
            const initializer = unwrapExpression(declarator.init)
            const isCreator =
              initializer?.type === "CallExpression" &&
              getName(initializer.callee) === "getEntityCreator"
            const isEntityManual = name?.endsWith("EntityManual")
            if (isCreator || isEntityManual) {
              context.report({
                node: declarator.id,
                messageId: "filename",
                data: { name, expected: `${name}.ts` },
              })
            }
          }
          return
        }
        if (isManual) {
          if (!declarators.some((node) => getName(node.id) === basename)) {
            context.report({
              node: program,
              messageId: "manual",
              data: { file: path.basename(filename), expected: basename },
            })
          }
          return
        }

        const creator = declarators.find((node) => {
          const initializer = unwrapExpression(node.init)
          return (
            getName(node.id) === basename &&
            initializer?.type === "CallExpression" &&
            getName(initializer.callee) === "getEntityCreator"
          )
        })
        const factoryName = `${basename}Factory`
        const factory = declarators.find(
          (node) => getName(node.id) === factoryName,
        )
        const requiredDeclarations = isVariantEntity
          ? [[creator, basename]]
          : [
              [creator, basename],
              [factory, factoryName],
            ]
        for (const [declaration, expected] of requiredDeclarations) {
          if (!declaration) {
            context.report({
              node: program,
              messageId: "declaration",
              data: { file: path.basename(filename), expected },
            })
          }
        }

        if (creator) {
          const call = unwrapExpression(creator.init)
          const argument = call.arguments[0]
          const expected = toConstantCase(basename.replace(/Entity$/, ""))
          if (argument?.type !== "Literal" || argument.value !== expected) {
            context.report({
              node: argument ?? call,
              messageId: "literal",
              data: { name: basename, expected },
            })
          }
        }

        const expectedVariants = `${basename}VariantsEnum`
        for (const declarator of declarators) {
          const name = getName(declarator.id)
          if (
            /Variants(?:Enum)?$/.test(name ?? "") &&
            name !== expectedVariants
          ) {
            context.report({
              node: declarator.id,
              messageId: "variants",
              data: { actual: name, expected: expectedVariants },
            })
          }
          const initializer = unwrapExpression(declarator.init)
          if (
            initializer?.type === "CallExpression" &&
            getName(initializer.callee) === basename &&
            hasAncestorNamed(declarator, "getDefault")
          ) {
            const expected = toCamelCase(basename.replace(/Entity$/, ""))
            if (name !== expected) {
              context.report({
                node: declarator.id,
                messageId: "instance",
                data: { entity: basename, expected },
              })
            }
          }
        }
      },
    }
  },
}
