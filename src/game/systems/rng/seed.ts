export type Seed = string
const SEED_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

export const generateSeed = (): Seed => {
  const bytes = crypto.getRandomValues(new Uint8Array(10))

  return Array.from(bytes, (byte) => SEED_ALPHABET[byte & 31]).join("")
}

// cyrb128: string -> 128-bit state
export const hashSeed = (str: string): number[] => {
  let h1 = 1779033703
  let h2 = 3144134277
  let h3 = 1013904242
  let h4 = 2773480762

  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i)

    h1 = h2 ^ Math.imul(h1 ^ k, 597399067)
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233)
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213)
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179)
  }

  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067)
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233)
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213)
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179)

  h1 ^= h2 ^ h3 ^ h4
  h2 ^= h1
  h3 ^= h1
  h4 ^= h1

  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0]
}
