export function generateValues(min: number, max: number, step: number): number[] {
  const values: number[] = []
  for (let i = min; i <= max; i += step) {
    values.push(i)
  }
  return values
}
