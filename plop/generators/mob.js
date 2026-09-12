import { toCamelCase, toConstantCase, toPascalCase } from "../names.js"
import { formatGeneratedFiles } from "../format.js"
import {
  getBaseMobFactoryImport,
  getCoreImport,
  getFactoryImport,
} from "../scaffold.js"
import { wireRegistry } from "../wiring.js"

const MOBS_PATH = "src/game/model/entities/mobs"

export const registerMobGenerator = (plop) => {
  plop.setActionType("wireMobRegistries", (answers) => {
    const name = toPascalCase(answers.name)
    const folder = toCamelCase(answers.name)

    const factoryResult = wireRegistry({
      filePath: `${MOBS_PATH}/factories.ts`,
      imports: [
        {
          source: `./${folder}/${name}Entity`,
          names: [`${name}Entity`, `${name}EntityFactory`],
        },
      ],
      mapName: "MOB_FACTORIES",
      entityName: `${name}Entity`,
      valueName: `${name}EntityFactory`,
    })
    const manualResult = wireRegistry({
      filePath: `${MOBS_PATH}/manuals.ts`,
      imports: [
        {
          source: `./${folder}/${name}Entity`,
          names: [`${name}Entity`],
        },
        {
          source: `./${folder}/${name}EntityManual`,
          names: [`${name}EntityManual`],
        },
      ],
      mapName: "MOB_MANUALS",
      entityName: `${name}Entity`,
      valueName: `${name}EntityManual`,
    })

    return `${factoryResult}; ${manualResult}`
  })

  plop.setGenerator("mob", {
    description: "Create a mob entity boilerplate and wire its registries",
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
      const folder = `mobs/${toCamelCase(answers.name)}`
      const entityPath = `${MOBS_PATH}/${toCamelCase(answers.name)}/${name}Entity.ts`
      const manualPath = `${MOBS_PATH}/${toCamelCase(answers.name)}/${name}EntityManual.ts`

      return [
        {
          type: "add",
          path: entityPath,
          templateFile: "plop-templates/entity/MobEntity.ts.hbs",
          data: {
            entityName: name,
            entityVariable: toCamelCase(answers.name),
            entityType: toConstantCase(answers.name),
            coreImport: getCoreImport(folder, "Entity"),
            baseFactoryImport: getBaseMobFactoryImport(folder),
            factoryImport: getFactoryImport(folder),
          },
        },
        {
          type: "add",
          path: manualPath,
          templateFile: "plop-templates/entity/EntityManual.ts.hbs",
          data: {
            entityName: name,
            manualImport: getFactoryImport(folder),
          },
        },
        {
          type: "wireMobRegistries",
        },
        () =>
          formatGeneratedFiles([
            entityPath,
            manualPath,
            `${MOBS_PATH}/factories.ts`,
            `${MOBS_PATH}/manuals.ts`,
          ]),
      ]
    },
  })
}
