import { readFileSync } from "node:fs"
import path from "node:path"
import {
  isIdentifier,
  j,
  parseStatement,
  unwrapExpression,
  writeAst,
} from "./ast.js"

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
  const name = `${familyName}EntityVariants`
  addImport(
    program,
    `./${variantName}/${variantName}Entity`,
    `${variantName}Entity`,
  )

  const aliases = root.find(j.TSTypeAliasDeclaration, {
    id: { type: "Identifier", name },
  })
  if (aliases.size() !== 1) {
    throw new Error(`Expected one ${name} declaration`)
  }
  const alias = aliases.nodes()[0]
  const declarations = root.find(j.VariableDeclarator, {
    id: { type: "Identifier", name },
  })
  let array
  if (declarations.size() === 0) {
    const names = j(alias)
      .find(j.TSTypeQuery)
      .nodes()
      .map((query) => query.exprName.left.name)
    const declaration = parseStatement(`export const ${name} = [
      ${names.map((entity) => `${entity}.type`).join(",")}
    ] as const`)
    const aliasIndex = program.body.findIndex(
      (node) =>
        node.type === "ExportNamedDeclaration" && node.declaration === alias,
    )
    program.body.splice(aliasIndex, 0, declaration)
    alias.typeAnnotation = parseStatement(
      `type Variants = (typeof ${name})[number]`,
    ).typeAnnotation
    for (const node of program.body) {
      if (node.type === "ImportDeclaration") node.importKind = "value"
    }
    array = unwrapExpression(declaration.declaration.declarations[0].init)
  } else {
    array = unwrapExpression(declarations.nodes()[0].init)
  }
  if (array.type !== "ArrayExpression") {
    throw new Error(`Expected a variants array in ${filePath}`)
  }
  if (
    !array.elements.some(
      (element) =>
        element?.type === "MemberExpression" &&
        isIdentifier(element.object, `${variantName}Entity`),
    )
  ) {
    array.elements.push(
      j.memberExpression(
        j.identifier(`${variantName}Entity`),
        j.identifier("type"),
      ),
    )
  }
  writeAst(filePath, root)
}

const getVariantMethod = (variantName, familyName) => {
  const root = j(`class Factory {
    getVariant(variant: EntityTypeArgument<${familyName}EntityVariants>): Entity {
      switch (resolveEntityType(variant)) {
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
  const variantsName = `${familyName}EntityVariants`
  const variantsImport = program.body.find(
    (node) =>
      node.type === "ImportDeclaration" &&
      node.specifiers.some((specifier) =>
        isIdentifier(specifier.imported, variantsName),
      ),
  )
  if (!variantsImport) throw new Error(`Missing variants import in ${filePath}`)
  variantsImport.importKind = "value"
  if (
    !classBody.some(
      (member) =>
        member.type === "ClassMethod" &&
        isIdentifier(member.key, "getVariants"),
    )
  ) {
    const variantsMethod = j(`class Factory {
      protected getVariants(): readonly ${variantsName}[] {
        return ${variantsName}
      }
    }`)
      .find(j.ClassMethod)
      .nodes()[0]
    classBody.unshift(variantsMethod)
  }
  const method = classBody.find(
    (member) =>
      member.type === "ClassMethod" && isIdentifier(member.key, "getVariant"),
  )
  if (!method) {
    const entityImport = program.body.find(
      (node) =>
        node.type === "ImportDeclaration" &&
        node.source.value.endsWith("core/model/Entity"),
    )
    if (!entityImport) {
      throw new Error(`Missing core Entity import in ${filePath}`)
    }
    const normalizeSource = path.posix.join(
      path.posix.dirname(entityImport.source.value),
      "queries/entities/normalize",
    )
    addImport(program, normalizeSource, "resolveEntityType")
    addImport(program, normalizeSource, "EntityTypeArgument", true)
    const newMethod = getVariantMethod(variantName, familyName)
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
