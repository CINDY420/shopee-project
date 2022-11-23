// format date number < 10, eg: 9 => 09
function formatNum(n) {
  return n < 10 ? '0' + n : n
}

export const RFC3339DateString = (d: Date) => {
  return `${d.getUTCFullYear()}-${formatNum(d.getUTCMonth() + 1)}-${formatNum(d.getUTCDate())}T${formatNum(
    d.getUTCHours()
  )}:${formatNum(d.getUTCMinutes())}:${formatNum(d.getUTCSeconds())}Z`
}

export const isInputDateValid = (startDate: number, endDate?: number): boolean => {
  return new Date().getTime() < startDate && startDate < endDate
}
