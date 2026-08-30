export type Seed = string
export const generateSeed = (): Seed =>
  crypto.randomUUID().slice(0, 8);