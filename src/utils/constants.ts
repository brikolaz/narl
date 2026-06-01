export const MAP_SIZE = 9 as const;
export const MAX_WORLD_SIZE = 2137 as const;
export const MIN_WORLD_POSITION = 0 as const;
export const MAX_WORLD_POSITION = MAX_WORLD_SIZE - 1;

export const INITIAL_PLAYER_POSITION = MAP_SIZE / MAP_SIZE - 1;
export const PLAYER_SIGN = "@" as const;
export const MISSING_COLOR = "pink" as const;
export const MISSING_GLYPH = "#" as const;
export const MAX_LOG = 50 as const;
export const MAX_VISIBLE_LOG = 5 as const;
export const DEFAULT_BACKPACK_SIZE = 9 as const;
export const INITIAL_TURN = 1 as const;
export const INITIAL_PLAYER_EXP = 0 as const;
export const DEFAULT_NEST_DEPTH = 0;
export const INV_SLOTS_PER_ROW = 3;
export const CURSED_PREFIX = "Cursed";
export const FLOOR_ITEM_COLOR = "yellow";

export const DEFAULT_SEED = "NARL" as const;
export const NAMESPACE_SEPARATOR = ":" as const;
export const MOBS_NAMESPACE_SEPARATOR = ":" as const;

