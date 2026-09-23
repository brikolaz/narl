import { toCamelCase, toConstantCase } from "../names.js"
import { formatGeneratedFiles } from "../format.js"
import {
  getBaseItemFactoryImport,
  getCoreImport,
  getFactoryImport,
  getScaffoldTarget,
  validateScaffoldTarget,
} from "../scaffold.js"

export const registerComponentGenerator = (plop) => {
  plop.setGenerator("component", {
    description: "Create a component creator boilerplate",
    prompts: [
      {
        type: "input",
        name: "target",
        message: "Component path/name:",
        validate: (value) => validateScaffoldTarget(value, "Component"),
      },
    ],
    actions: (answers) => {
      const { folder, name } = getScaffoldTarget(answers.target, "Component")
      const targetFolder = folder ? `${folder}/` : ""
      const outputPath = `src/game/model/components/${targetFolder}${name}Component.ts`

      return [
        {
          type: "add",
          path: outputPath,
          templateFile: "scripts/plop/templates/component/Component.ts.hbs",
          data: {
            componentName: name,
            componentType: toConstantCase(name),
            coreImport: getCoreImport(folder, "Component"),
          },
        },
        () => formatGeneratedFiles([outputPath]),
      ]
    },
  })
}

export const registerEntityGenerator = (plop) => {
  plop.setGenerator("entity", {
    description: "Create an entity creator and factory boilerplate",
    prompts: [
      {
        type: "input",
        name: "target",
        message: "Entity path/name:",
        validate: (value) => validateScaffoldTarget(value, "Entity"),
      },
    ],
    actions: (answers) => {
      const { folder, name } = getScaffoldTarget(answers.target, "Entity")
      const familyFolder = folder
        ? `${folder}/${toCamelCase(name)}`
        : toCamelCase(name)
      const itemFactory =
        folder === "items" ||
        folder.startsWith("items/") ||
        folder === "eq/slots" ||
        folder.startsWith("eq/slots/")
      const variantFolder = `${familyFolder}/variants/${name}`
      const entityPath = `src/game/model/entities/${variantFolder}/${name}Entity.ts`
      const variantsPath = `src/game/model/entities/${familyFolder}/variants/variants.ts`
      const factoryPath = `src/game/model/entities/${familyFolder}/factory.ts`

      return [
        {
          type: "add",
          path: entityPath,
          templateFile: "scripts/plop/templates/entity/Entity.ts.hbs",
          data: {
            entityName: name,
            entityVariable: toCamelCase(name),
            entityType: toConstantCase(name),
            coreImport: getCoreImport(variantFolder, "Entity"),
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
          templateFile: itemFactory
            ? "scripts/plop/templates/entity/ItemFactory.ts.hbs"
            : "scripts/plop/templates/entity/factory.ts.hbs",
          data: {
            entityName: name,
            coreImport: getCoreImport(familyFolder, "Entity"),
            factoryImport: getFactoryImport(familyFolder),
            factoryType: itemFactory ? "ItemFactory" : "Factory",
            itemFactory,
            baseItemFactoryImport: getBaseItemFactoryImport(familyFolder),
          },
        },
        () => formatGeneratedFiles([entityPath, variantsPath, factoryPath]),
      ]
    },
  })
}
