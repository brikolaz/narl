import { readFileSync } from "node:fs"
import { isIdentifier, j, parseStatement, writeAst } from "./ast.js"

export const addImport = (program, source, name, typeOnly = false) => {
  const existing = program.body.find(
    (node) =>
      node.type === "ImportDeclaration" &&
      node.source.value === source &&
      node.importKind === (typeOnly ? "type" : "value"),
  )
  if (existing) {
    if (
      !existing.specifiers.some(
        (specifier) =>
          specifier.type === "ImportSpecifier" &&
          isIdentifier(specifier.imported, name),
      )
    ) {
      existing.specifiers.push(j.importSpecifier(j.identifier(name)))
    }
    return
  }

  const declaration = j.importDeclaration(
    [j.importSpecifier(j.identifier(name))],
    j.stringLiteral(source),
  )
  if (typeOnly) {
    declaration.importKind = "type"
  }
  const lastImportIndex = program.body.findLastIndex(
    (node) => node.type === "ImportDeclaration",
  )
  program.body.splice(lastImportIndex + 1, 0, declaration)
}

export const wireVariantUnion = ({ filePath, familyName, variantName }) => {
  const root = j(readFileSync(filePath, "utf8"))
  const program = root.find(j.Program).nodes()[0]
  addImport(
    program,
    `./${variantName}/${variantName}Entity`,
    `${variantName}Entity`,
    true,
  )

  const aliases = root.find(j.TSTypeAliasDeclaration, {
    id: { type: "Identifier", name: `${familyName}EntityVariants` },
  })
  if (aliases.size() !== 1) {
    throw new Error(`Expected one ${familyName}EntityVariants declaration`)
  }
  const alias = aliases.nodes()[0]
  const variantType = parseStatement(
    `type Variant = typeof ${variantName}Entity.type`,
  ).typeAnnotation
  const types =
    alias.typeAnnotation.type === "TSUnionType"
      ? alias.typeAnnotation.types
      : [alias.typeAnnotation]
  const alreadyWired = types.some(
    (type) =>
      type.type === "TSTypeQuery" &&
      type.exprName.type === "TSQualifiedName" &&
      isIdentifier(type.exprName.left, `${variantName}Entity`),
  )
  if (!alreadyWired) {
    alias.typeAnnotation = j.tsUnionType([...types, variantType])
  }
  writeAst(filePath, root)
}

const getVariantMethod = (variantName) => {
  const root = j(`class Factory {
    getVariant(variant: Variants): Entity {
      switch (variant) {
        case ${variantName}Entity.type:
          return ${variantName}Entity()
        default:
          return this.getDefault()
      }
    }
  }`)
  return root
    .find(j.ClassMethod, {
      key: { type: "Identifier", name: "getVariant" },
    })
    .nodes()[0]
}

export const wireFactoryVariant = ({ filePath, variantName, familyName }) => {
  const root = j(readFileSync(filePath, "utf8"))
  const program = root.find(j.Program).nodes()[0]
  addImport(
    program,
    `./variants/${variantName}/${variantName}Entity`,
    `${variantName}Entity`,
  )

  const classes = root.find(j.ClassDeclaration)
  if (classes.size() !== 1) {
    throw new Error(`Expected one factory class in ${filePath}`)
  }
  const classBody = classes.nodes()[0].body.body
  const method = classBody.find(
    (member) =>
      member.type === "ClassMethod" && isIdentifier(member.key, "getVariant"),
  )
  if (!method) {
    const newMethod = getVariantMethod(variantName)
    newMethod.params[0].typeAnnotation = j.tsTypeAnnotation(
      j.tsTypeReference(j.identifier(`${familyName}EntityVariants`)),
    )
    classBody.push(newMethod)
    writeAst(filePath, root)
    return
  }

  const switches = j(method).find(j.SwitchStatement)
  if (switches.size() !== 1) {
    throw new Error(`Expected one switch in getVariant() in ${filePath}`)
  }
  const cases = switches.nodes()[0].cases
  const alreadyWired = cases.some(
    (switchCase) =>
      switchCase.test?.type === "MemberExpression" &&
      isIdentifier(switchCase.test.object, `${variantName}Entity`) &&
      isIdentifier(switchCase.test.property, "type"),
  )
  if (!alreadyWired) {
    const generatedCases = j(`switch (variant) {
      case ${variantName}Entity.type:
        return ${variantName}Entity()
    }`)
      .find(j.SwitchStatement)
      .nodes()[0].cases
    const defaultIndex = cases.findIndex((switchCase) => !switchCase.test)
    cases.splice(
      defaultIndex === -1 ? cases.length : defaultIndex,
      0,
      ...generatedCases,
    )
  }
  writeAst(filePath, root)
}
