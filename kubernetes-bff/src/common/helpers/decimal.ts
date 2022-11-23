// Round to at most 2 decimal places (only if necessary)
export function roundToTwo(num: number) {
  return Math.round((+num + Number.EPSILON) * 100) / 100
}
