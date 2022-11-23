import { constants } from 'http2'
import { Cache } from 'cache-manager'
import jwtDecode from 'jwt-decode'
import * as jwt from 'jsonwebtoken'
import { stringify } from 'querystring'
import { ConfigService } from '@nestjs/config'
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common'

import { ERROR } from '@/common/constants/error'
import { IRequestParams, SearchParams } from '@/common/interfaces/http'
import { Http } from '@/common/utils/http'
import { Logger } from '@/common/utils/logger'
import { throwError } from '@/common/utils/throw-error'
import { AUTH_CERTS_CACHE_KEY, FOREVER, TWO_HOURS } from '@/common/constants/sessions'
import { AUTH_DEFAULT_OFFSET, AUTH_MAX_SEARCH_COUNT } from '@/common/constants/auth'
import { tryCatch } from '@/common/utils/try-catch'
import { PermissionEnvMap, RESOURCE_TYPE } from '@/common/constants/rbac'
import { IServiceURLConfig } from '@/common/interfaces/config'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
import { QUERY_ALL } from '@/common/constants/query'
import {
  IApproverList,
  IBatchGetUsers,
  ICerts,
  IJWTHeader,
  IJWTPayLoad,
  IListQuery,
  IPermission,
  IPermissions,
  IRoleBind,
  IAddRolePayload,
  IRoleBinding,
  ITenant,
  ITenantOrBotInfo,
  ITenantPermissions,
  ITenantUsers,
  IUserRoles,
} from '@/shared/auth/auth.interface'

@Injectable()
export class AuthService {
  private defaultOptions: Pick<IRequestParams, 'urlPrefix'>

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
    private httpService: Http,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(AuthService.name)

    const authConfig = this.configService.get<IServiceURLConfig>('auth')
    if (!authConfig) {
      throwError(ERROR.SYSTEM_ERROR.AUTH.INIT_ERROR)
    }

    const { protocol, host, port } = authConfig
    const authServer = port ? `${protocol}://${host}:${port}` : `${protocol}://${host}`

    this.defaultOptions = {
      urlPrefix: authServer,
    }
  }

  private async request<TResponseBody = unknown, TRequestParams = SearchParams, TRequestBody = Record<string, unknown>>(
    requestParams: IRequestParams<TRequestParams, TRequestBody>,
  ): Promise<TResponseBody> {
    const {
      urlPrefix = this.defaultOptions.urlPrefix,
      resourceURI,
      apiVersion = 'v1',
      query,
      headers,
      token,
      body,
      method = 'GET',
    } = requestParams
    const route = `${urlPrefix}/${apiVersion}/${resourceURI}`
    const tokenHeaders = token ? { [constants.HTTP2_HEADER_AUTHORIZATION]: `Bearer ${token}` } : {}

    const [result, error] = await this.httpService.request<TResponseBody>({
      url: route,
      method,
      searchParams: query ?? {},
      json: body,
      headers: { ...tokenHeaders, ...headers },
    })

    if (error || !result) {
      const { message, code, status } = ERROR.SYSTEM_ERROR.AUTH.REQUEST_ERROR
      throwError(`${message}: ${error?.message}`, code, error?.response?.statusCode ?? status)
    } else {
      return result
    }
  }

  async verifyToken(token: string): Promise<IJWTPayLoad> {
    const { message, code } = ERROR.SYSTEM_ERROR.AUTH.REQUEST_ERROR
    const [decodedTokenHeader, error] = await tryCatch<IJWTHeader>(Promise.resolve(jwtDecode(token, { header: true })))
    if (error || !decodedTokenHeader) {
      throwError(`${message}: ${error}`, code, HttpStatus.UNAUTHORIZED)
    } else {
      const { kid = '' } = decodedTokenHeader
      if (!kid.length) {
        throwError(`${message}: jwt header kid not found`, code, HttpStatus.UNAUTHORIZED)
      }

      let cachedCerts = await this.cacheManager.get<Record<string, string>>(AUTH_CERTS_CACHE_KEY)
      let publicKey = cachedCerts?.[kid]
      if (!publicKey) {
        const response = await this.request<ICerts>({ method: 'GET', resourceURI: 'certs' })
        cachedCerts = response.certs
        await this.cacheManager.set(AUTH_CERTS_CACHE_KEY, cachedCerts, { ttl: FOREVER })
        publicKey = cachedCerts[kid]
      }
      const [payload, error] = await tryCatch(Promise.resolve(jwt.verify(token, publicKey) as IJWTPayLoad))
      if (error || !payload) {
        throwError(`${message}: ${error?.message}`, code, HttpStatus.UNAUTHORIZED)
      } else {
        return payload
      }
    }
  }

  async getUserRoles(id: number, token: string): Promise<IUserRoles> {
    const response = await this.request<IUserRoles>({ method: 'GET', resourceURI: `users/${id}/roles`, token })

    return response
  }

  async getRolePermissions(roleId: number, token: string): Promise<IPermissions> {
    const roleKey = `role=${roleId}`

    let rolePermissions = await this.cacheManager.get<IPermissions>(roleKey)
    if (!rolePermissions) {
      const newPermissions = await this.request<IPermissions, IListQuery, IPermissions>({
        method: 'GET',
        resourceURI: `roles/${roleId}/permissions`,
        query: { offset: AUTH_DEFAULT_OFFSET, limit: AUTH_MAX_SEARCH_COUNT },
        token,
      })
      await this.cacheManager.set(roleKey, newPermissions, { ttl: TWO_HOURS })
      rolePermissions = newPermissions
    }

    return rolePermissions
  }

  async getTenantPermissions(roleBindings: IRoleBinding[], token: string): Promise<ITenantPermissions> {
    const rolePermissionList: Array<{ roleBinding: IRoleBinding; permissions: IPermission[] }> = await Promise.all(
      roleBindings.map(async (roleBinding) => {
        const { permissions } = await this.getRolePermissions(roleBinding.roleId, token)

        return {
          roleBinding,
          permissions,
        }
      }),
    )

    return rolePermissionList.reduce<ITenantPermissions>((tenantPermissionsMap, rolePermission) => {
      const { roleBinding, permissions } = rolePermission
      const { tenantId } = roleBinding

      tenantPermissionsMap[tenantId] = permissions.reduce<Record<RESOURCE_TYPE, string[]>>((prev, permission) => {
        const actions = prev[permission.resource] || []
        const label = permission.label
        const env = label ? PermissionEnvMap[label] : undefined
        const envAction = env ? `${permission.action}${env}` : permission.action

        actions.push(envAction)
        prev[permission.resource] = actions
        return prev
      }, {} as Record<RESOURCE_TYPE, string[]>)

      return tenantPermissionsMap
    }, {})
  }

  async getTenantOrBotById(id: number, token: string, type: string) {
    const key = `${type}/${id}`
    const cachedTenantOrBotInfo = await this.cacheManager.get<ITenantOrBotInfo>(key)
    if (cachedTenantOrBotInfo) {
      return cachedTenantOrBotInfo
    }
    const newTenantOrBotInfo = await this.request<ITenantOrBotInfo>({
      method: 'GET',
      resourceURI: `${type}/${id}`,
      token,
    })
    await this.cacheManager.set(key, newTenantOrBotInfo, { ttl: 60 * 60 * 24 * 2 })
    return newTenantOrBotInfo
  }

  async getTenantById(tenantId: number, token: string) {
    const tenantKey = `tenant/${tenantId}`
    let tenantInfo = await this.cacheManager.get<ITenant>(tenantKey)
    if (!tenantInfo) {
      tenantInfo = await this.request<ITenant>({ method: 'GET', resourceURI: `tenants/${tenantId}`, token })
      await this.cacheManager.set(tenantKey, tenantInfo, { ttl: TWO_HOURS })
    }

    return tenantInfo
  }

  async getRoleById(roleId: number, token: string) {
    const roleKey = `role-info-${roleId}`
    let roleInfo = await this.cacheManager.get<IRoleBind>(roleKey)
    if (!roleInfo) {
      roleInfo = await this.request<IRoleBind>({
        method: 'GET',
        resourceURI: `roles/${roleId}`,
        token,
      })

      await this.cacheManager.set(roleKey, roleInfo, { ttl: TWO_HOURS })
    }

    return roleInfo
  }

  async listTenantTerminalApprovers(tenantId: number, token: string) {
    const approverList = await this.request<IApproverList>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/approvers`,
      token,
      query: {
        offset: AUTH_DEFAULT_OFFSET,
        limit: AUTH_MAX_SEARCH_COUNT,
        kind: 'terminal',
      },
    })

    return approverList
  }

  async listTenantUserApprovers(tenantId: number, token: string) {
    const approverList = await this.request<IApproverList>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/approvers`,
      token,
      query: {
        offset: AUTH_DEFAULT_OFFSET,
        limit: AUTH_MAX_SEARCH_COUNT,
        kind: 'user',
      },
    })

    return approverList
  }

  async batchGetUsers(userIds: number[], token: string) {
    const query = new URLSearchParams(userIds.map((userId) => ['ids', String(userId)])).toString()
    return this.request<IBatchGetUsers>({
      method: 'GET',
      query,
      resourceURI: 'users:batchGet',
      token,
    })
  }

  async getUserName(token: string, userId?: number) {
    if (!userId) {
      return ''
    }
    const { users } = await this.batchGetUsers([userId], token)
    return users?.[0]?.name ?? ''
  }

  async deleteTenantRole(tenantId: number, userId: number, roleId: number, token: string) {
    await this.request({
      resourceURI: `tenants/${tenantId}/users/${userId}/roles/${roleId}`,
      method: 'DELETE',
      token,
    })
  }

  async addTenantRole(tenantId: number, userId: number, payload: IAddRolePayload, token: string) {
    await this.request({
      resourceURI: `tenants/${tenantId}/users/${userId}:addRole`,
      method: 'POST',
      body: payload,
      token,
    })
  }

  getTenantUserList(tenantId: number, query: ListQuery, token: string) {
    const { offset, limit, filterBy, orderBy } = query
    return this.request<ITenantUsers>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/users`,
      token,
      query: stringify({
        offset,
        limit,
        filterBy,
        orderBy,
      }),
    })
  }

  getPlatformAdmins(token: string) {
    const PLATFORM_TENANT_ID = 0
    const PLATFORM_ADMIN_ROLE_NAME = '2000'

    return this.getTenantUserList(
      PLATFORM_TENANT_ID,
      {
        ...QUERY_ALL,
        filterBy: `roleName==${PLATFORM_ADMIN_ROLE_NAME}`,
      },
      token,
    )
  }
}
