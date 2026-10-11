import { wireItemFamily } from "./item.js"
import { toCamelCase, toConstantCase } from "../names.js"
import { formatGeneratedFiles } from "../format.js"
import {
  getBaseItemFactoryImport,
  getCoreImport,
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

export const registerItemFamilyGenerator = (plop) => {
  plop.setGenerator("item", {
    description: "Create an item family and register its factory",
    prompts: [
      {
        type: "input",
        name: "target",
        message: "Item path/name:",
        validate: (value) => validateScaffoldTarget(value, "Entity"),
      },
    ],
    actions: (answers) => {
      const { folder, name } = getScaffoldTarget(answers.target, "Entity")
      const itemFolder = folder
        ? `${folder}/${toCamelCase(name)}`
        : toCamelCase(name)
      const familyFolder = `items/${itemFolder}`
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
          templateFile: "scripts/plop/templates/entity/ItemFactory.ts.hbs",
          data: {
            entityName: name,
            coreImport: getCoreImport(familyFolder, "Entity"),
            baseItemFactoryImport: getBaseItemFactoryImport(familyFolder),
          },
        },
        () => wireItemFamily({ familyFolder: itemFolder, familyName: name }),
        () =>
          formatGeneratedFiles([
            entityPath,
            variantsPath,
            factoryPath,
            "src/game/model/entities/items/factories.ts",
          ]),
      ]
    },
  })
}
