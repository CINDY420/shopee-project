import { formatFloat } from 'helpers/format'

export const NoLimitResourceText = 'No-Limit'

export const formatLimitAndRequestText = (value: number, unit: string) => {
  return `${value === 0 ? `${NoLimitResourceText}` : `${formatFloat(value)} ${unit}`}`
}
