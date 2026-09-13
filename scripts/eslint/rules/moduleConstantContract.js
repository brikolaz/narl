import {
  getEnumObject,
  getName,
  getTypeReferenceName,
  getVariableDeclarators,
  unwrapExpression,
} from "../ast.js"

export const moduleConstantContract = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require global constants and registries to use UPPER_SNAKE_CASE",
    },
    schema: [],
    messages: {
      name: "Module-level constant or registry '{{actual}}' must use UPPER_SNAKE_CASE.",
    },
  },
  create(context) {
    const isEnumLike = (initializer) => Boolean(getEnumObject(initializer))
    const isStructuralException = (name) =>
      /(?:Component|Entity|Factory|Manual|Variants)$/.test(name)
    const containsRegistryType = (type) => {
      if (!type) return false
      if (
        getTypeReferenceName(type) &&
        ["Map", "ReadonlyMap", "Set", "ReadonlySet"].includes(
          getTypeReferenceName(type),
        )
      ) {
        return true
      }
      if (type.type === "TSArrayType") {
        return containsRegistryType(type.elementType)
      }
      return false
    }
    const isRegistry = (declarator) => {
      const initializer = declarator.init
      if (
        initializer?.type === "TSSatisfiesExpression" &&
        ["ActionResolverMap", "Record"].includes(
          getTypeReferenceName(initializer.typeAnnotation),
        )
      ) {
        return true
      }
      const value = unwrapExpression(initializer)
      if (
        value?.type === "NewExpression" &&
        ["Map", "Set"].includes(getName(value.callee))
      ) {
        return true
      }
      const annotation = declarator.id.typeAnnotation?.typeAnnotation
      if (containsRegistryType(annotation)) return true

      const name = getName(declarator.id)
      return (
        /(?:Factories|Manuals|Resolvers|Registry|Table|Map|Set|State|Config)$/.test(
          name ?? "",
        ) &&
        [
          "ArrayExpression",
          "CallExpression",
          "NewExpression",
          "ObjectExpression",
        ].includes(value?.type)
      )
    }

    const isExported = (declarator) =>
      declarator.parent?.parent?.type === "ExportNamedDeclaration"

    return {
      "Program:exit"(program) {
        for (const declarator of getVariableDeclarators(program)) {
          const declaration = declarator.parent
          if (declaration?.kind !== "const") continue
          const name = getName(declarator.id)
          if (
            !name ||
            isEnumLike(declarator.init) ||
            isStructuralException(name)
          )
            continue
          const value = unwrapExpression(declarator.init)
          const isPrimitiveConstant = [
            "BinaryExpression",
            "Literal",
            "TemplateLiteral",
            "UnaryExpression",
          ].includes(value?.type)
          const isExportedStaticValue =
            isExported(declarator) &&
            [
              "ArrayExpression",
              "CallExpression",
              "NewExpression",
              "ObjectExpression",
            ].includes(value?.type) &&
            !["getComponentCreator", "getEntityCreator"].includes(
              getName(value?.callee),
            )
          if (
            (isRegistry(declarator) ||
              isPrimitiveConstant ||
              isExportedStaticValue) &&
            !/^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/.test(name)
          ) {
            context.report({
              node: declarator.id,
              messageId: "name",
              data: { actual: name },
            })
          }
        }
      },
    }
  },
}
