import { getName, unwrapExpression } from "../ast.js"

const isModuleVariable = (node) => {
  const declaration = node.parent
  const container = declaration?.parent
  return (
    declaration?.type === "VariableDeclaration" &&
    (container?.type === "Program" ||
      (container?.type === "ExportNamedDeclaration" &&
        container.parent?.type === "Program"))
  )
}

const getDeclaredNames = (declaration) => {
  if (declaration?.type === "VariableDeclaration") {
    return declaration.declarations.map((node) => getName(node.id))
  }
  return [getName(declaration?.id)]
}

const getExportedNames = (program) => {
  const names = new Set()
  for (const statement of program.body) {
    if (
      statement.type !== "ExportNamedDeclaration" &&
      statement.type !== "ExportDefaultDeclaration"
    ) {
      continue
    }
    for (const name of getDeclaredNames(statement.declaration)) {
      if (name) names.add(name)
    }
    if (statement.type === "ExportNamedDeclaration" && !statement.source) {
      for (const specifier of statement.specifiers) {
        const name = getName(specifier.local)
        if (name) names.add(name)
      }
    }
    if (statement.type === "ExportDefaultDeclaration") {
      const name = getName(statement.declaration)
      if (name) names.add(name)
    }
  }
  return names
}

export const underscoreContract = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Allow leading underscores only for private module-level functions",
    },
    schema: [],
    messages: {
      name: "Leading underscore is allowed only on non-exported module-level functions.",
    },
  },
  create(context) {
    let exportedNames = new Set()
    return {
      Program(node) {
        exportedNames = getExportedNames(node)
      },
      VariableDeclarator(node) {
        const name = getName(node.id)
        if (!name?.startsWith("_")) return
        const value = unwrapExpression(node.init)
        const isFunction = [
          "ArrowFunctionExpression",
          "FunctionExpression",
        ].includes(value?.type)
        const isExported = exportedNames.has(name)
        if (!isFunction || !isModuleVariable(node) || isExported) {
          context.report({ node: node.id, messageId: "name" })
        }
      },
      FunctionDeclaration(node) {
        const name = getName(node.id)
        if (!name?.startsWith("_")) return
        const container = node.parent
        const isExported = exportedNames.has(name)
        const isModule =
          container?.type === "Program" ||
          ((container?.type === "ExportNamedDeclaration" ||
            container?.type === "ExportDefaultDeclaration") &&
            container.parent?.type === "Program")
        if (!isModule || isExported) {
          context.report({ node: node.id, messageId: "name" })
        }
      },
    }
  },
}
