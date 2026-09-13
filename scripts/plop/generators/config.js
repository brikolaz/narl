export const ACTION_RESOLVER_CONFIG = {
  internal: {
    actionTypeObject: "InternalActionTypeEnum",
    actionTypeFile: "src/game/systems/internal/types.ts",
    actionUnionName: "InternalAction",
    resolverMapFile: "src/game/systems/internal/resolvers.ts",
    resolverMapName: "INTERNAL_ACTION_RESOLVERS",
    actionKeyPrefix: "INTERNAL_",
  },
  player: {
    actionTypeObject: "PlayerActionTypeEnum",
    actionTypeFile: "src/game/systems/player/types.ts",
    actionUnionName: "PlayerAction",
    resolverMapFile: "src/game/systems/player/resolvers.ts",
    resolverMapName: "PLAYER_ACTION_RESOLVERS",
    actionKeyPrefix: "PLAYER_",
  },
  world: {
    actionTypeObject: "WorldActionTypeEnum",
    actionTypeFile: "src/game/systems/world/types.ts",
    actionUnionName: "WorldAction",
    resolverMapFile: "src/game/systems/world/resolvers.ts",
    resolverMapName: "WORLD_ACTION_RESOLVERS",
    actionKeyPrefix: "WORLD_",
  },
}
