export const checkIfManagerByPosition = (position: string): boolean => {
  return position.startsWith('Manager')
}

export const checkIfAssistantManagerByPosition = (position: string): boolean => {
  return position.startsWith('Assistant Manager')
}

export const checkIfProductManagementByPosition = (position: string): boolean => {
  const titles = position.split(',')
  if (titles.length > 1) {
    return titles[1].includes('Product management')
  }

  return false
}

export const checkIfQAByDepartmentPath = (departmentPath: string): boolean => {
  return departmentPath.endsWith('QA')
}

const firstUpperCase = (str) => {
  return str.replace(/^\S/, (s) => s.toUpperCase())
}

export const parseUserNameFromEmail = (email: string): string => {
  return email
    .split('@')[0]
    .split('.')
    .map((name) => {
      return firstUpperCase(name)
    })
    .join(' ')
}
