export const checkIfHasError = (error: object = {}) => {
  return !!Object.values(error).find(errInfo => !!errInfo)
}

export const checkIfFormHasError = (errors = []) => {
  return errors.some(item => {
    if (item.errors) {
      return item.errors.length > 0
    }
    return false
  })
}
