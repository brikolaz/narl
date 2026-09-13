import { readFileSync } from "node:fs"
import {
  addImports,
  getTypeAlias,
  isIdentifier,
  j,
  parseStatement,
  unwrapExpression,
  writeAst,
} from "./ast.js"

const getRegistryEntries = (root, mapName, filePath) => {
  const declarators = root.find(j.VariableDeclarator, {
    id: { type: "Identifier", name: mapName },
  })
  if (declarators.size() !== 1) {
    throw new Error(`Expected one ${mapName} declaration in ${filePath}`)
  }

  const initializer = declarators.nodes()[0].init
  const entries = initializer?.arguments?.[0]
  if (
    initializer?.type !== "NewExpression" ||
    !isIdentifier(initializer.callee, "Map") ||
    entries?.type !== "ArrayExpression"
  ) {
    throw new Error(`${mapName} is not initialized with new Map([...])`)
  }

  return entries.elements
}

export const wireRegistry = ({
  filePath,
  imports,
  mapName,
  entityName,
  valueName,
}) => {
  const root = j(readFileSync(filePath, "utf8"))
  const entries = getRegistryEntries(root, mapName, filePath)
  const alreadyWired = entries.some(
    (entry) =>
      entry?.type === "ArrayExpression" &&
      entry.elements.length === 2 &&
      entry.elements[0]?.type === "MemberExpression" &&
      isIdentifier(entry.elements[0].object, entityName) &&
      isIdentifier(entry.elements[0].property, "type") &&
      isIdentifier(entry.elements[1], valueName),
  )
  const entryLabel = `[${entityName}.type, ${valueName}]`
  if (alreadyWired) {
    return `${filePath} already contains ${entryLabel}`
  }

  const program = root.find(j.Program).nodes()[0]
  addImports(program, imports)
  entries.push(
    j.arrayExpression([
      j.memberExpression(j.identifier(entityName), j.identifier("type")),
      j.identifier(valueName),
    ]),
  )

  writeAst(filePath, root)
  return `wired ${entryLabel} in ${filePath}`
}

export const wireActionTypes = ({
  filePath,
  actionTypeObject,
  actionKey,
  actionTypeName,
  actionUnionName,
}) => {
  const root = j(readFileSync(filePath, "utf8"))
  const declarators = root.find(j.VariableDeclarator, {
    id: { type: "Identifier", name: actionTypeObject },
  })
  if (declarators.size() !== 1) {
    throw new Error(
      `Expected one ${actionTypeObject} declaration in ${filePath}`,
    )
  }

  const actionTypes = unwrapExpression(declarators.nodes()[0].init)
  if (
    actionTypes?.type !== "CallExpression" ||
    !isIdentifier(actionTypes.callee, "createEnum")
  ) {
    throw new Error(
      `${actionTypeObject} is not created with createEnum in ${filePath}`,
    )
  }
  if (
    actionTypes.arguments.some(
      (argument) =>
        argument.type === "StringLiteral" && argument.value === actionKey,
    )
  ) {
    throw new Error(`${actionTypeObject}.${actionKey} already exists`)
  }

  const enumValue = parseStatement(`const value = createEnum("${actionKey}");`)
    .declarations[0].init.arguments[0]
  actionTypes.arguments.push(enumValue)

  const program = root.find(j.Program).nodes()[0]
  const unionStatementIndex = program.body.findIndex((statement) => {
    const declaration =
      statement.type === "ExportNamedDeclaration"
        ? statement.declaration
        : statement
    return (
      declaration?.type === "TSTypeAliasDeclaration" &&
      isIdentifier(declaration.id, actionUnionName)
    )
  })
  if (unionStatementIndex === -1) {
    throw new Error(`No ${actionUnionName} union in ${filePath}`)
  }

  const actionTypeStatement = parseStatement(
    `export type ${actionTypeName} = { type: typeof ${actionTypeObject}.${actionKey} };`,
  )
  program.body.splice(unionStatementIndex, 0, actionTypeStatement)

  const actionUnion = getTypeAlias(root, actionUnionName, filePath)
  const actionReference = parseStatement(
    `type Value = ${actionTypeName};`,
  ).typeAnnotation
  if (actionUnion.typeAnnotation.type === "TSUnionType") {
    actionUnion.typeAnnotation.types.push(actionReference)
  } else {
    actionUnion.typeAnnotation = j.tsUnionType([
      actionUnion.typeAnnotation,
      actionReference,
    ])
  }

  writeAst(filePath, root)
  return `wired ${actionTypeName} in ${filePath}`
}

export const wireActionResolver = ({
  filePath,
  importSource,
  resolverName,
  resolverMapName,
  actionTypeObject,
  actionKey,
  resolverUnionName,
}) => {
  const root = j(readFileSync(filePath, "utf8"))
  const declarators = root.find(j.VariableDeclarator, {
    id: { type: "Identifier", name: resolverMapName },
  })
  if (declarators.size() !== 1) {
    throw new Error(
      `Expected one ${resolverMapName} declaration in ${filePath}`,
    )
  }

  const resolverMap = unwrapExpression(declarators.nodes()[0].init)
  if (resolverMap?.type !== "ObjectExpression") {
    throw new Error(`${resolverMapName} is not an object in ${filePath}`)
  }
  const alreadyWired = resolverMap.properties.some(
    (property) =>
      property.type === "ObjectProperty" &&
      property.computed &&
      property.key.type === "MemberExpression" &&
      isIdentifier(property.key.object, actionTypeObject) &&
      isIdentifier(property.key.property, actionKey),
  )
  if (alreadyWired) {
    throw new Error(`${actionTypeObject}.${actionKey} resolver already exists`)
  }

  const program = root.find(j.Program).nodes()[0]
  addImports(program, [{ source: importSource, names: [resolverName] }])
  const resolverProperty = parseStatement(
    `const value = { [${actionTypeObject}.${actionKey}]: ${resolverName} };`,
  ).declarations[0].init.properties[0]
  resolverMap.properties.push(resolverProperty)

  if (resolverUnionName) {
    const resolverUnion = getTypeAlias(root, resolverUnionName, filePath)
    const resolverReference = parseStatement(
      `type Value = typeof ${resolverName};`,
    ).typeAnnotation
    if (resolverUnion.typeAnnotation.type === "TSUnionType") {
      resolverUnion.typeAnnotation.types.push(resolverReference)
    } else {
      resolverUnion.typeAnnotation = j.tsUnionType([
        resolverUnion.typeAnnotation,
        resolverReference,
      ])
    }
  }

  writeAst(filePath, root)
  return `wired ${resolverName} in ${filePath}`
}
