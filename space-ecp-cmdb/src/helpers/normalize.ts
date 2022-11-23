export const normalizeNumber = (value: string | number) => {
  const result = Number(value)
  return isNaN(result) ? value : result
}
