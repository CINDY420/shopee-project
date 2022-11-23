import { LABEL_ROLE_KEY, ROLES } from 'common/constants/node'

export const getRoleFromLabel = (label: string): ROLES => {
  const [key, role] = label.split('/')
  if (key !== LABEL_ROLE_KEY || !role) {
    return ROLES.UNSPECIFIED
  }

  return role as ROLES
}
