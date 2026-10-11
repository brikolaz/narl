import { getTypeAlias, isIdentifier, j, writeAst } from "../ast.js"
import { wireRegistry } from "../wiring.js"
import { existsSync, readFileSync } from "node:fs"
import { formatGeneratedFiles } from "../format.js"
import { toCamelCase, toConstantCase, toPascalCase } from "../names.js"
import { getCoreImport } from "../scaffold.js"
import { addImport, wireFactoryVariant, wireVariantUnion } from "../variants.js"

const ITEMS_PATH = "src/game/model/entities/items"

export const wireItemFamily = ({ familyFolder, familyName }) => {
  const filePath = `${ITEMS_PATH}/factories.ts`
  const root = j(readFileSync(filePath, "utf8"))
  const program = root.find(j.Program).nodes()[0]
  const variantType = `${familyName}EntityVariants`
  addImport(program, `./${familyFolder}/variants/variants`, variantType, true)
  const alias = getTypeAlias(root, "ItemEntityVariants", filePath)
  const types =
    alias.typeAnnotation.type === "TSUnionType"
      ? alias.typeAnnotation.types
      : [alias.typeAnnotation]
  if (
    !types.some(
      (type) =>
        type.type === "TSTypeReference" &&
        isIdentifier(type.typeName, variantType),
    )
  ) {
    alias.typeAnnotation = j.tsUnionType([
      ...types,
      j.tsTypeReference(j.identifier(variantType)),
    ])
  }
  writeAst(filePath, root)
  return wireRegistry({
    filePath,
    imports: [
      {
        source: `./${familyFolder}/variants/${familyName}/${familyName}Entity`,
        names: [`${familyName}Entity`],
      },
      {
        source: `./${familyFolder}/factory`,
        names: [`${familyName}EntityFactory`],
      },
    ],
    mapName: "ITEM_FACTORIES",
    entityName: `${familyName}Entity`,
    valueName: `${familyName}EntityFactory`,
  })
}

const getItemFamilyPath = (base) => `${ITEMS_PATH}/${toCamelCase(base)}`

const assertItemFamilyExists = (base) => {
  const familyPath = getItemFamilyPath(base)
  const requiredFiles = [
    `${familyPath}/factory.ts`,
    `${familyPath}/variants/variants.ts`,
  ]
  if (requiredFiles.some((filePath) => !existsSync(filePath))) {
    throw new Error(
      `Item family does not exist or is incomplete: ${familyPath}`,
    )
  }
  return familyPath
}

export const registerItemGenerator = (plop) => {
  plop.setActionType("wireItemVariant", (answers) => {
    const familyFolder = toCamelCase(answers.base)
    const familyName = toPascalCase(answers.base)
    const variantName = toPascalCase(answers.variant)
    const familyPath = assertItemFamilyExists(answers.base)

    wireVariantUnion({
      filePath: `${familyPath}/variants/variants.ts`,
      familyName,
      variantName,
    })
    wireFactoryVariant({
      filePath: `${familyPath}/factory.ts`,
      familyName,
      variantName,
    })
    return `wired ${variantName} in ${familyName} item family`
  })

  plop.setGenerator("item:variant", {
    description: "Add a variant to an existing item family",
    prompts: [
      {
        type: "input",
        name: "base",
        message: "Item family:",
        validate: (value) =>
          toPascalCase(value).length > 0 || "Item family is required",
      },
      {
        type: "input",
        name: "variant",
        message: "Variant name:",
        validate: (value) =>
          toPascalCase(value).length > 0 || "Variant name is required",
      },
    ],
    actions: (answers) => {
      assertItemFamilyExists(answers.base)
      const familyFolder = toCamelCase(answers.base)
      const variantName = toPascalCase(answers.variant)
      const variantFolder = `items/${familyFolder}/variants/${variantName}`
      const entityPath = `${ITEMS_PATH}/${familyFolder}/variants/${variantName}/${variantName}Entity.ts`

      return [
        {
          type: "add",
          path: entityPath,
          templateFile: "scripts/plop/templates/entity/Entity.ts.hbs",
          data: {
            entityName: variantName,
            entityVariable: toCamelCase(answers.variant),
            entityType: toConstantCase(answers.variant),
            coreImport: getCoreImport(variantFolder, "Entity"),
          },
        },
        { type: "wireItemVariant" },
        () =>
          formatGeneratedFiles([
            entityPath,
            `${ITEMS_PATH}/${familyFolder}/variants/variants.ts`,
            `${ITEMS_PATH}/${familyFolder}/factory.ts`,
          ]),
      ]
    },
  })
}
