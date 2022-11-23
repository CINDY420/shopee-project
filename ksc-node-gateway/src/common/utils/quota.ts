import { MEMORY_UNIT } from '@/common/constants/quota'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'

/**
 * Convert memory value of input unit to a value of target unit
 * @value memory value
 * @valueUnit memory unit
 * @targetUnit return unit
 */
const convertMemoryQuotaToNumber = (value: number, valueUnit: MEMORY_UNIT, targetUnit: MEMORY_UNIT): number => {
  const memoryUnitConversionType = `${valueUnit}-to-${targetUnit}`
  /**
   * Question: why use 'switch' rather than 'map'?
   * Answer: 'switch' only compute one case and return, while 'Map' compute all cases but return only one case,
   * 'Map' takes up much more cpu.
   */
  switch (memoryUnitConversionType) {
    case `${MEMORY_UNIT.GI}-to-${MEMORY_UNIT.GI}`:
    case `${MEMORY_UNIT.MI}-to-${MEMORY_UNIT.MI}`:
    case `${MEMORY_UNIT.KI}-to-${MEMORY_UNIT.KI}`:
      return value
    case `${MEMORY_UNIT.GI}-to-${MEMORY_UNIT.MI}`:
    case `${MEMORY_UNIT.MI}-to-${MEMORY_UNIT.KI}`:
      return value * 1024
    case `${MEMORY_UNIT.GI}-to-${MEMORY_UNIT.KI}`:
      return value * 1024 ** 2
    case `${MEMORY_UNIT.MI}-to-${MEMORY_UNIT.GI}`:
    case `${MEMORY_UNIT.KI}-to-${MEMORY_UNIT.MI}`:
      return value / 1024
    case `${MEMORY_UNIT.KI}-to-${MEMORY_UNIT.GI}`:
      return value / 1024 ** 2
    default:
      throwError(ERROR.SYSTEM_ERROR.UTIL_ERROR, '[convertMemoryQuotaToNumber()] valueUnit and targetUnit are invalid!')
  }
}

/**
 * Format kubernetes memory quota to a number value of target unit
 * @memoryQuota kubernetes memory quota, for example, '30Gi', '20Mi', '40Ki'
 * @targetUnit kubernetes memory quota unit, for example, 'Gi' | 'Mi' | 'Ki'
 */
export const convertK8sMemoryQuotaToNumber = (memoryQuota: string, targetUnit: MEMORY_UNIT): number => {
  let memoryValue = 0
  let memoryUnit = MEMORY_UNIT.GI
  const unitList = Object.values(MEMORY_UNIT)
  // extract value and unit of memoryQuota, and verify
  const isValidUnit = unitList.some((unit) => {
    if (memoryQuota.endsWith(unit)) {
      const memoryValueUnitArray = memoryQuota.split(unit)
      memoryValue = Number(memoryValueUnitArray[0])
      if (isNaN(memoryValue)) {
        throwError(ERROR.SYSTEM_ERROR.UTIL_ERROR, '[convertK8sMemoryQuotaToNumber()] memory quota value is not number')
      }
      memoryUnit = unit
      return true
    }
    return false
  })
  if (!isValidUnit) {
    throwError(ERROR.SYSTEM_ERROR.UTIL_ERROR, '[convertK8sMemoryQuotaToNumber()] memory quota unit is not Gi, Mi or Ki')
  }

  // convert unit
  const convertedMemoryQuota = convertMemoryQuotaToNumber(memoryValue, memoryUnit, targetUnit)
  return convertedMemoryQuota
}
