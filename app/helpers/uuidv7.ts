// app/helpers/uuid.ts

/**
 * Generates a UUIDv7 — time-ordered, URL-safe, ideal for slugs & primary keys.
 * Format: xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx
 */
export function uuidv7(): string {
  const now = BigInt(Date.now())

  const timeBits = now & 0xffffffffffffn

  const randA = BigInt(Math.floor(Math.random() * 0x1000))

  const randB =
    (BigInt(Math.floor(Math.random() * 0x3fffffff)) << 32n) |
    BigInt(Math.floor(Math.random() * 0x100000000))

  const hi = (timeBits << 16n) | (7n << 12n) | randA
  const lo = (2n << 62n) | randB

  const toHex = (val: bigint, len: number) => val.toString(16).padStart(len, '0')

  const hex = toHex(hi, 16) + toHex(lo, 16)

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-')
}

/**
 * Extracts the timestamp embedded in a UUIDv7.
 * Useful for created_at inference without a DB column.
 */
export function uuidv7ToDate(uuid: string): Date {
  const hex = uuid.replace(/-/g, '').slice(0, 12)
  const ms = Number.parseInt(hex, 16)
  return new Date(ms)
}
