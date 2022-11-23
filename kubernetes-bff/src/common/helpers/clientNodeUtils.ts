// This file is used to store the utilities functions used by this project but not exported from client-node
export const unitMultipliers = {
  n: 1000 ** -3,
  u: 1000 ** -2,
  m: 1000 ** -1,
  k: 1000,
  M: 1000 ** 2,
  G: 1000 ** 3,
  T: 1000 ** 4,
  P: 1000 ** 5,
  E: 1000 ** 6,
  Ki: 1024,
  Mi: 1024 ** 2,
  Gi: 1024 ** 3,
  Ti: 1024 ** 4,
  Pi: 1024 ** 5,
  Ei: 1024 ** 6
}

export function cpuQuantityScalar(input: string): number {
  const unitMatch = input.match(/^([0-9]+)([A-Za-z]{1,2})$/)

  let result = null

  if (unitMatch) {
    result = parseFloat(unitMatch[1]) * unitMultipliers[unitMatch[2]]
  } else {
    result = parseFloat(input)
  }

  if (isNaN(result)) {
    throw new Error('Unknown cpu quantity ' + input)
  }

  return result
}

export function memoryQuantityScalar(input: string): number {
  const unitMatch = input.match(/^([0-9]+)([A-Za-z]{1,2})$/)

  let result = null

  if (unitMatch) {
    result = parseFloat(unitMatch[1]) * unitMultipliers[unitMatch[2]]
  } else {
    result = parseFloat(input)
  }

  if (isNaN(result)) {
    throw new Error('Unknown memory quantity ' + input)
  }

  return result / unitMultipliers.Gi
}
