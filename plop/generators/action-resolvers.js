import {
  normalizeActionName,
  toActionFolder,
  toConstantCase,
  toPascalCase,
} from "../names.js"
import { formatGeneratedFiles } from "../format.js"
import { wireActionResolver, wireActionTypes } from "../wiring.js"

const ACTION_RESOLVER_CONFIG = {
  internal: {
    actionTypeObject: "InternalActionType",
    actionTypeFile: "src/game/systems/internal/type.ts",
    actionUnionName: "InternalAction",
    resolverMapFile: "src/game/systems/internal/resolvers.ts",
    resolverMapName: "internalActionResolvers",
    resolverUnionName: "InternalActionResolver",
    actionValuePrefix: "INTERNAL_",
  },
  player: {
    actionTypeObject: "PlayerActionType",
    actionTypeFile: "src/game/systems/player/types.ts",
    actionUnionName: "PlayerAction",
    resolverMapFile: "src/game/systems/player/resolvers.ts",
    resolverMapName: "playerActionResolvers",
    actionValuePrefix: "PLAYER_",
  },
  world: {
    actionTypeObject: "WorldActionType",
    actionTypeFile: "src/game/systems/world/types.ts",
    actionUnionName: "WorldAction",
    resolverMapFile: "src/game/systems/world/resolvers.ts",
    resolverMapName: "worldActionResolvers",
    actionValuePrefix: "WORLD_",
  },
}

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
        const actionKey = toConstantCase(name)
        const actionTypeName = `${kindName}${name}Action`
        const resolverName = `resolve${kindName}${name}Action`
        const resolverFile = `${resolverName}.ts`
        const resolverPath = `src/game/systems/${folder}/${resolverFile}`

        return [
          {
            type: "add",
            path: resolverPath,
            templateFile: `plop-templates/action-resolver/${kind}.ts.hbs`,
            data: { actionTypeName, resolverName },
          },
          () =>
            wireActionTypes({
              filePath: config.actionTypeFile,
              actionTypeObject: config.actionTypeObject,
              actionKey,
              actionValue: `${config.actionValuePrefix}${actionKey}`,
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
