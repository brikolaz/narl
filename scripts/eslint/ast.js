export const unwrapExpression = (node) => {
  let current = node
  while (
    current &&
    [
      "ChainExpression",
      "TSAsExpression",
      "TSNonNullExpression",
      "TSSatisfiesExpression",
      "TSTypeAssertion",
    ].includes(current.type)
  ) {
    current = current.expression
  }
  return current
}

export const getName = (node) => {
  if (!node) return undefined
  if (node.type === "Identifier") return node.name
  if (node.type === "Literal" && typeof node.value === "string") {
    return node.value
  }
  return undefined
}

const getDeclaration = (statement) =>
  statement.type === "ExportNamedDeclaration"
    ? statement.declaration
    : statement

export const getVariableDeclarators = (program) =>
  program.body.flatMap((statement) => {
    const declaration = getDeclaration(statement)
    return declaration?.type === "VariableDeclaration"
      ? declaration.declarations
      : []
  })

export const getTypeReferenceName = (node) =>
  node?.type === "TSTypeReference" ? getName(node.typeName) : undefined

export const getTypeArguments = (node) =>
  node?.typeArguments?.params ?? node?.typeParameters?.params ?? []

export const getUnionMemberNames = (node) => {
  const members = node?.type === "TSUnionType" ? node.types : [node]
  return new Set(members.map(getTypeReferenceName).filter(Boolean))
}

export const getEnumObject = (initializer) => {
  const call = unwrapExpression(initializer)
  if (
    call?.type !== "CallExpression" ||
    getName(call.callee) !== "createEnum"
  ) {
    return undefined
  }
  return {
    node: call,
    properties: call.arguments.map((argument) => ({
      type: "Property",
      computed: false,
      key: argument,
      value: argument,
    })),
  }
}
