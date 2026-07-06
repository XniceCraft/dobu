export function getStreak(streak: number): {
  purple: number
  blue: number
} {
  const blue = streak % 10
  const purple = (streak - blue) / 10

  return { purple, blue }
}
