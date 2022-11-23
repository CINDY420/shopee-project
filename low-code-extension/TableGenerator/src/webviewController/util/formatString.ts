export const capitalizeString = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const decapitalizeString = (value: string) => {
  return value.charAt(0).toLowerCase() + value.slice(1)
}
