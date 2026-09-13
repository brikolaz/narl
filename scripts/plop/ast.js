import { writeFileSync } from "node:fs"
import jscodeshift from "jscodeshift"

export const j = jscodeshift.withParser("ts")

export const isIdentifier = (node, name) =>
  node?.type === "Identifier" && node.name === name

export const unwrapExpression = (node) => {
  let expression = node
  while (
    expression?.type === "TSAsExpression" ||
    expression?.type === "TSSatisfiesExpression"
  ) {
    expression = expression.expression
  }
  return expression
}

export const parseStatement = (source) =>
  j(source).find(j.Program).nodes()[0].body[0]

export const writeAst = (filePath, root) => {
  const output = root.toSource({ quote: "double", trailingComma: true })
  writeFileSync(filePath, output.endsWith("\n") ? output : `${output}\n`)
}

export const addImports = (program, imports) => {
  const newDeclarations = []

  for (const definition of imports) {
    const declaration = program.body.find(
      (node) =>
        node.type === "ImportDeclaration" &&
        node.source.value === definition.source,
    )
    const missingNames = definition.names.filter(
      (name) =>
        !declaration?.specifiers.some(
          (specifier) =>
            specifier.type === "ImportSpecifier" &&
            isIdentifier(specifier.imported, name),
        ),
    )

    if (declaration) {
      declaration.specifiers.push(
        ...missingNames.map((name) => j.importSpecifier(j.identifier(name))),
      )
      continue
    }
    if (missingNames.length > 0) {
      newDeclarations.push(
        j.importDeclaration(
          missingNames.map((name) => j.importSpecifier(j.identifier(name))),
          j.stringLiteral(definition.source),
        ),
      )
    }
  }

  const lastImportIndex = program.body.findLastIndex(
    (node) => node.type === "ImportDeclaration",
  )
  const insertIndex = lastImportIndex === -1 ? 0 : lastImportIndex
  program.body.splice(insertIndex, 0, ...newDeclarations)
}

export const getTypeAlias = (root, name, filePath) => {
  const aliases = root.find(j.TSTypeAliasDeclaration, {
    id: { type: "Identifier", name },
  })
  if (aliases.size() !== 1) {
    throw new Error(`Expected one ${name} type alias in ${filePath}`)
  }
  return aliases.nodes()[0]
}
