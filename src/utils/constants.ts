export const BASE_NAMESPACE = 'narl';
export const ECS_NAMESPACE = 'ecs';

export const MAP_SIZE = 9 as const;
export const MAX_WORLD_SIZE = 2137 as const;
export const MIN_WORLD_POSITION = 0 as const;
export const MAX_WORLD_POSITION = MAX_WORLD_SIZE - 1;

export const INITIAL_PLAYER_POSITION = MIN_WORLD_POSITION;
export const DEFAULT_PLAYER_BACKPACK_SIZE = 9 as const;
export const DEFAULT_PLAYER_GLYPH = "@" as const;
export const INITIAL_TURN = 1 as const;
export const CURSED_PREFIX = "Cursed";

export const DEFAULT_SEED = "NARL" as const;
export const NAMESPACE_SEPARATOR = "." as const;
export const MOBS_RNG_NAMESPACE = "mobs" as const;
export const ITEMS_RNG_NAMESPACE = "items" as const;

export const MAX_VISIBLE_LOGS = 5 as const;
