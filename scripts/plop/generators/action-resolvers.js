import {
  normalizeActionName,
  toActionFolder,
  toConstantCase,
  toPascalCase,
} from "../names.js"
import { formatGeneratedFiles } from "../format.js"
import { wireActionResolver, wireActionTypes } from "../wiring.js"
import { ACTION_RESOLVER_CONFIG } from "./config.js"

export const registerActionResolverGenerators = (plop) => {
  for (const [kind, config] of Object.entries(ACTION_RESOLVER_CONFIG)) {
    const kindName = toPascalCase(kind)
    plop.setGenerator(`action-resolver:${kind}`, {
      description: `Create and wire a ${kind} action resolver`,
      prompts: [
        {
          type: "input",
          name: "name",
          message: `${kindName} action name:`,
          validate: (value) =>
            normalizeActionName(value, kindName).length > 0 ||
            "Action name is required",
        },
      ],
      actions: (answers) => {
        const name = normalizeActionName(answers.name, kindName)
        const folder = toActionFolder(name)
        const actionKey = `${config.actionKeyPrefix}${toConstantCase(name)}`
        const actionTypeName = `${kindName}${name}Action`
        const resolverName = `resolve${kindName}${name}Action`
        const resolverFile = `${resolverName}.ts`
        const resolverPath = `src/game/systems/${folder}/${resolverFile}`

        return [
          {
            type: "add",
            path: resolverPath,
            templateFile: `scripts/plop/templates/action-resolver/${kind}.ts.hbs`,
            data: { actionTypeName, resolverName },
          },
          () =>
            wireActionTypes({
              filePath: config.actionTypeFile,
              actionTypeObject: config.actionTypeObject,
              actionKey,
              actionTypeName,
              actionUnionName: config.actionUnionName,
            }),
          () =>
            wireActionResolver({
              filePath: config.resolverMapFile,
              importSource: `../${folder}/${resolverName}`,
              resolverName,
              resolverMapName: config.resolverMapName,
              actionTypeObject: config.actionTypeObject,
              actionKey,
              resolverUnionName: config.resolverUnionName,
            }),
          () =>
            formatGeneratedFiles([
              resolverPath,
              config.actionTypeFile,
              config.resolverMapFile,
            ]),
        ]
      },
    })
  }
}
