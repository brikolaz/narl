import { existsSync, readFileSync } from "node:fs"
import { isIdentifier, j, writeAst } from "../ast.js"
import { toCamelCase, toConstantCase, toPascalCase } from "../names.js"
import { formatGeneratedFiles } from "../format.js"
import {
  getBaseMobFactoryImport,
  getCoreImport,
  getManualImport,
} from "../scaffold.js"
import { wireRegistry } from "../wiring.js"
import { addImport, wireFactoryVariant, wireVariantUnion } from "../variants.js"

const MOBS_PATH = "src/game/model/entities/mobs"

const getMobFamilyPath = (base) => `${MOBS_PATH}/${toCamelCase(base)}`

const assertMobFamilyExists = (base) => {
  const familyPath = getMobFamilyPath(base)
  const requiredFiles = [
    `${familyPath}/factory.ts`,
    `${familyPath}/variants/variants.ts`,
  ]
  if (requiredFiles.some((filePath) => !existsSync(filePath))) {
    throw new Error(`Mob family does not exist or is incomplete: ${familyPath}`)
  }
  return familyPath
}

const wireMobFamilyUnion = ({ familyFolder, familyName }) => {
  const filePath = `${MOBS_PATH}/factories.ts`
  const root = j(readFileSync(filePath, "utf8"))
  const program = root.find(j.Program).nodes()[0]
  addImport(
    program,
    `./${familyFolder}/variants/variants`,
    `${familyName}EntityVariants`,
    true,
  )

  const aliases = root.find(j.TSTypeAliasDeclaration, {
    id: { type: "Identifier", name: "MobEntityVariants" },
  })
  if (aliases.size() !== 1) {
    throw new Error(`Expected one MobEntityVariants declaration in ${filePath}`)
  }
  const alias = aliases.nodes()[0]
  const types =
    alias.typeAnnotation.type === "TSUnionType"
      ? alias.typeAnnotation.types
      : [alias.typeAnnotation]
  if (
    !types.some(
      (type) =>
        type.type === "TSTypeReference" &&
        isIdentifier(type.typeName, `${familyName}EntityVariants`),
    )
  ) {
    alias.typeAnnotation = j.tsUnionType([
      ...types,
      j.tsTypeReference(j.identifier(`${familyName}EntityVariants`)),
    ])
  }
  writeAst(filePath, root)
}

const wireMobRegistries = ({ familyFolder, entityName, factoryName }) => {
  const factoryResult = wireRegistry({
    filePath: `${MOBS_PATH}/factories.ts`,
    imports: [
      {
        source: `./${familyFolder}/variants/${entityName}/${entityName}Entity`,
        names: [`${entityName}Entity`],
      },
      {
        source: `./${familyFolder}/factory`,
        names: [`${factoryName}EntityFactory`],
      },
    ],
    mapName: "MOB_FACTORIES",
    entityName: `${entityName}Entity`,
    valueName: `${factoryName}EntityFactory`,
  })
  const manualResult = wireRegistry({
    filePath: `${MOBS_PATH}/manuals.ts`,
    imports: [
      {
        source: `./${familyFolder}/variants/${entityName}/${entityName}Entity`,
        names: [`${entityName}Entity`],
      },
      {
        source: `./${familyFolder}/variants/${entityName}/${entityName}EntityManual`,
        names: [`${entityName}EntityManual`],
      },
    ],
    mapName: "MOB_MANUALS",
    entityName: `${entityName}Entity`,
    valueName: `${entityName}EntityManual`,
  })
  return `${factoryResult}; ${manualResult}`
}

export const registerMobGenerator = (plop) => {
  plop.setActionType("wireMobRegistries", (answers) => {
    const familyFolder = toCamelCase(answers.name)
    const familyName = toPascalCase(answers.name)
    wireMobFamilyUnion({ familyFolder, familyName })
    return wireMobRegistries({
      familyFolder,
      entityName: familyName,
      factoryName: familyName,
    })
  })

  plop.setActionType("wireMobVariant", (answers) => {
    const familyFolder = toCamelCase(answers.base)
    const familyName = toPascalCase(answers.base)
    const variantName = toPascalCase(answers.variant)
    const familyPath = assertMobFamilyExists(answers.base)

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
    return wireMobRegistries({
      familyFolder,
      entityName: variantName,
      factoryName: familyName,
    })
  })

  plop.setGenerator("mob", {
    description: "Create a mob family and wire its registries",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Mob name:",
        validate: (value) =>
          toPascalCase(value).length > 0 || "Mob name is required",
      },
    ],
    actions: (answers) => {
      const name = toPascalCase(answers.name)
      const familyFolder = toCamelCase(answers.name)
      const familyPath = `${MOBS_PATH}/${familyFolder}`
      const variantFolder = `mobs/${familyFolder}/variants/${name}`
      const entityPath = `${familyPath}/variants/${name}/${name}Entity.ts`
      const manualPath = `${familyPath}/variants/${name}/${name}EntityManual.ts`
      const variantsPath = `${familyPath}/variants/variants.ts`
      const factoryPath = `${familyPath}/factory.ts`

      return [
        {
          type: "add",
          path: entityPath,
          templateFile: "scripts/plop/templates/entity/MobEntity.ts.hbs",
          data: {
            entityName: name,
            entityVariable: toCamelCase(answers.name),
            entityType: toConstantCase(answers.name),
            coreImport: getCoreImport(variantFolder, "Entity"),
          },
        },
        {
          type: "add",
          path: manualPath,
          templateFile: "scripts/plop/templates/entity/EntityManual.ts.hbs",
          data: {
            manualImport: getManualImport(variantFolder),
            entityName: name,
          },
        },
        {
          type: "add",
          path: variantsPath,
          templateFile: "scripts/plop/templates/entity/variants.ts.hbs",
          data: { entityName: name },
        },
        {
          type: "add",
          path: factoryPath,
          templateFile: "scripts/plop/templates/entity/MobFactory.ts.hbs",
          data: {
            entityName: name,
            coreImport: getCoreImport(`mobs/${familyFolder}`, "Entity"),
            baseFactoryImport: getBaseMobFactoryImport(`mobs/${familyFolder}`),
          },
        },
        { type: "wireMobRegistries" },
        () =>
          formatGeneratedFiles([
            entityPath,
            manualPath,
            variantsPath,
            factoryPath,
            `${MOBS_PATH}/factories.ts`,
            `${MOBS_PATH}/manuals.ts`,
          ]),
      ]
    },
  })

  plop.setGenerator("mob:variant", {
    description: "Add a variant to an existing mob family",
    prompts: [
      {
        type: "input",
        name: "base",
        message: "Mob family:",
        validate: (value) =>
          toPascalCase(value).length > 0 || "Mob family is required",
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
      assertMobFamilyExists(answers.base)
      const familyFolder = toCamelCase(answers.base)
      const variantName = toPascalCase(answers.variant)
      const variantFolder = `mobs/${familyFolder}/variants/${variantName}`
      const entityPath = `${MOBS_PATH}/${familyFolder}/variants/${variantName}/${variantName}Entity.ts`
      const manualPath = `${MOBS_PATH}/${familyFolder}/variants/${variantName}/${variantName}EntityManual.ts`

      return [
        {
          type: "add",
          path: entityPath,
          templateFile: "scripts/plop/templates/entity/MobEntity.ts.hbs",
          data: {
            entityName: variantName,
            entityVariable: toCamelCase(answers.variant),
            entityType: toConstantCase(answers.variant),
            coreImport: getCoreImport(variantFolder, "Entity"),
          },
        },
        {
          type: "add",
          path: manualPath,
          templateFile: "scripts/plop/templates/entity/EntityManual.ts.hbs",
          data: {
            entityName: variantName,
            manualImport: getManualImport(variantFolder),
          },
        },
        { type: "wireMobVariant" },
        () =>
          formatGeneratedFiles([
            entityPath,
            manualPath,
            `${MOBS_PATH}/${familyFolder}/variants/variants.ts`,
            `${MOBS_PATH}/${familyFolder}/factory.ts`,
            `${MOBS_PATH}/factories.ts`,
            `${MOBS_PATH}/manuals.ts`,
          ]),
      ]
    },
  })
}
