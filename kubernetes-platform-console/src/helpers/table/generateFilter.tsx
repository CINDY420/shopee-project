import { localTimeToUTC } from 'helpers/format'

export const generateTimeRangeFilter = (dateRangeStrings: string[], disableUTC = false) => {
  if (dateRangeStrings === undefined) {
    return ''
  }
  return disableUTC
    ? `creationTimestamp>=${dateRangeStrings[0]};creationTimestamp<=${dateRangeStrings[1]}`
    : `creationTimestamp>=${localTimeToUTC(dateRangeStrings[0])};creationTimestamp<=${localTimeToUTC(
        dateRangeStrings[1]
      )}`
}

export const generateFilter = (filters: string[]) => {
  return filters.filter(item => item).join(';')
}
