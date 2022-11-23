import { globalAuthState } from 'states'
import { useRecoilValue } from 'recoil'
import { IUserRoles } from 'swagger-api/models'

type INeedCheckRoles = Omit<IUserRoles, 'roleName'>
/**
 * useCheckRoles 用来校验角色
 * @param needCheckRoles 需要校验的role数组
 * @returns boolean，判断是否有角色
 */
export default function useCheckRoles(needCheckRoles: INeedCheckRoles[]) {
  const { roles } = useRecoilValue(globalAuthState)

  if (!roles || roles.length === 0) return false

  return needCheckRoles.some((needCheckRole) => {
    const roleId = needCheckRole.roleId
    const tenantId = needCheckRole.tenantId
    const projectId = needCheckRole.projectId
    return roles.some((role) => {
      if (role.roleId.toString() !== roleId) return false

      if (tenantId && role.tenantId !== tenantId) return false

      if (projectId && role.projectId !== projectId) return false

      return true
    })
  })
}
