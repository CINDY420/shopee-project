import { useEffect, useState, useMemo, useCallback } from 'react'
import { generatePath, useRoutes, matchRoutes, useLocation, useNavigate } from 'react-router-dom'
import { ACCESS_APPLY, TENANT } from 'constants/routes/route'
import { listRoutes } from './routes'
import { tenantControllerListTenants } from 'swagger-api/apis/Tenant'
import { accountControllerGetUserDetail } from 'swagger-api/apis/Account'
import { getSession, setSession, IUserInfo } from 'helpers/session'
import * as ramda from 'ramda'
import { globalAuthState } from 'states'
import { useSetRecoilState } from 'recoil'

const session = getSession()
const AppIndex = () => {
  const [pathRedirectToTenant, setPathRedirectToTenant] = useState<string>('')
  const [permissions, setPermissions] = useState<IUserInfo['permissions']>()
  const [roles, setRoles] = useState<IUserInfo['roles']>()
  const location = useLocation()
  const navigate = useNavigate()
  const setRecoilValue = useSetRecoilState(globalAuthState)

  const addPermissionsInSessions = useCallback(
    async (session) => {
      const { permissions: newPermissions, roles: newRoles } = await accountControllerGetUserDetail(
        {
          userId: session.userId,
        },
      )
      if (ramda.isEmpty(newPermissions)) {
        navigate(ACCESS_APPLY, { replace: true })
        return
      }
      setSession({ ...session, permissions: newPermissions, roles: newRoles })
      setRecoilValue({ ...session, permissions: newPermissions, roles: newRoles })

      if (!ramda.equals(permissions, newPermissions)) setPermissions(newPermissions)

      if (!ramda.equals(roles, newRoles)) setRoles(newRoles)
    },
    [navigate, permissions, roles, setRecoilValue],
  )

  const listTenantsAsync = useCallback(async () => {
    const { items } = await tenantControllerListTenants({})
    if (items && items.length > 0)
      setPathRedirectToTenant(generatePath(TENANT, { tenantId: items[0].tenantId }))
  }, [])

  const initPermissions = useCallback(() => {
    if (session?.userId) addPermissionsInSessions(session)
  }, [addPermissionsInSessions])

  useEffect(() => {
    listTenantsAsync()
    initPermissions()
  }, [initPermissions, listTenantsAsync])

  const routes = useMemo(
    () => listRoutes({ pathRedirectToTenant, permissions, roles }),
    [pathRedirectToTenant, permissions, roles],
  )

  useEffect(() => {
    const matchs = matchRoutes(routes, location.pathname)
    const matchTenantRoutes = matchRoutes(routes, TENANT)
    // 如果没有tenant，则跳转到权限申请页面
    if (matchTenantRoutes && matchTenantRoutes.length <= 1) {
      session?.userId && navigate(ACCESS_APPLY, { replace: true })
      return
    }
    if ((!matchs || matchs.length === 1) && pathRedirectToTenant)
      navigate(pathRedirectToTenant, {
        replace: true,
      })
  }, [pathRedirectToTenant, navigate, routes, location.pathname])

  return useRoutes(routes)
}

export default AppIndex
