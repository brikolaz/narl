import path from "node:path"
import {
  getName,
  getTypeArguments,
  getTypeReferenceName,
  unwrapExpression,
} from "../ast.js"
import { toConstantCase } from "../names.js"

export const ecsComponentContract = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce component filenames, creators, props, and runtime types",
    },
    schema: [],
    messages: {
      filename:
        "Component creator '{{name}}' must be declared in '{{expected}}'.",
      creator:
        "Component file '{{file}}' must declare '{{expected}}' with getComponentCreator(...).",
      literal: "{{name}} must use runtime type '{{expected}}'.",
      props: "Component props type '{{actual}}' must be named '{{expected}}'.",
    },
  },
  create(context) {
    const filename = context.filename.replaceAll(path.sep, "/")
    if (
      !filename.includes("/src/game/model/components/") ||
      !filename.endsWith(".ts")
    ) {
      return {}
    }
    const basename = path.basename(filename, ".ts")
    const isComponentFile = basename.endsWith("Component")
    const expectedType = toConstantCase(basename.replace(/Component$/, ""))
    const creators = []
    const propsAliases = []

    return {
      VariableDeclarator(node) {
        const initializer = unwrapExpression(node.init)
        if (
          initializer?.type === "CallExpression" &&
          getName(initializer.callee) === "getComponentCreator"
        ) {
          creators.push({ node, call: initializer })
        }
      },
      TSTypeAliasDeclaration(node) {
        if (node.id.name.endsWith("ComponentProps")) propsAliases.push(node)
      },
      "Program:exit"(program) {
        if (!isComponentFile) {
          for (const { node } of creators) {
            const name = getName(node.id)
            context.report({
              node: node.id,
              messageId: "filename",
              data: { name, expected: `${name}.ts` },
            })
          }
          return
        }
        const creator = creators.find(
          ({ node }) => getName(node.id) === basename,
        )
        if (!creator || creators.length !== 1) {
          context.report({
            node: program,
            messageId: "creator",
            data: { file: path.basename(filename), expected: basename },
          })
        } else {
          const argument = creator.call.arguments[0]
          if (argument?.type !== "Literal" || argument.value !== expectedType) {
            context.report({
              node: argument ?? creator.call,
              messageId: "literal",
              data: { name: basename, expected: expectedType },
            })
          }
        }

        const expectedProps = `${basename}Props`
        const hasDefaults = (creator?.call.arguments.length ?? 0) > 1
        const propsArgument = creator
          ? getTypeArguments(creator.call)[0]
          : undefined
        if (creator && (hasDefaults || propsArgument)) {
          const propsType = getTypeReferenceName(propsArgument)
          if (propsType !== expectedProps) {
            context.report({
              node: propsArgument ?? creator.call,
              messageId: "props",
              data: {
                actual: propsType ?? "<missing>",
                expected: expectedProps,
              },
            })
          }
          if (!propsAliases.some((alias) => alias.id.name === expectedProps)) {
            context.report({
              node: creator.node.id,
              messageId: "props",
              data: { actual: "<missing>", expected: expectedProps },
            })
          }
        }
        for (const alias of propsAliases) {
          if (alias.id.name !== expectedProps) {
            context.report({
              node: alias.id,
              messageId: "props",
              data: { actual: alias.id.name, expected: expectedProps },
            })
          }
        }
      },
    }
  },
}
