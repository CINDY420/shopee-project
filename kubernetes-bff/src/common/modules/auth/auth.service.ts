import {
  Injectable,
  HttpException,
  Inject,
  CACHE_MANAGER,
  UnauthorizedException,
  Logger,
  InternalServerErrorException
} from '@nestjs/common'
import { stringify } from 'querystring'
import axios, { Method } from 'axios'
import { ConfigService } from '@nestjs/config'
import {
  ITenant,
  ITenants,
  IUsers,
  IBot,
  IBots,
  IAccessToken,
  IAuthConfig,
  ICerts,
  IJWTHeader,
  IJWTPayLoad,
  IUserRoles,
  IPermissions,
  ITenantRoles,
  IRoleBinding,
  IApproverList,
  IRoleBind,
  IAddRolePayload,
  IBatchGetUsers,
  IBatchGetTenants,
  IListQuery,
  IBotInfo
} from 'common/interfaces/authService.interface'
import { ES_MAX_SEARCH_COUNT, ES_DEFAULT_OFFSET } from 'common/constants/es'
import { AUTH_SERVICE_COOKIE_KEY, AUTH_CERTS_CACHE_KEY, FOREVER, TWO_HOURS } from 'common/constants/sessions'

import { Cache } from 'cache-manager'
import jwt_decode from 'jwt-decode'
import * as jwt from 'jsonwebtoken'
import { HTTP_AGENT } from 'common/constants/http'
import { PermissionEnvMap, PERMISSION_GROUP, PLATFORM_ROLE_SCOPE, RESOURCE_TYPE } from 'common/constants/rbac'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'
import { PolicyService } from 'policy/policy.service'

interface IRequestArgs {
  server?: string
  method?: Method
  resource: string
  version?: string
  params?: Record<string, any>
  headers?: Record<string, any>
  token?: string
  payload?: Record<string, any>
}

export type ITenantPermissions = Record<number, Record<RESOURCE_TYPE, string[]>>

type AuthRequestFn = <T>(args: IRequestArgs) => Promise<T>

@Injectable()
export class AuthService {
  request: AuthRequestFn
  private readonly logger = new Logger(AuthService.name)
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
    private readonly policyService: PolicyService
  ) {
    const authConfig = this.configService.get<IAuthConfig>('auth')
    if (!authConfig) {
      this.logger.error('Can not get auth service config!')
      return
    }

    const { protocol, host, port } = authConfig
    const authServer = port ? `${protocol}://${host}:${port}` : `${protocol}://${host}`

    this.request = async (args) => {
      const { server = authServer, resource, version = 'v1', params, headers, token, payload, method = 'get' } = args
      const route = `${server}/${version}/${resource}`
      const tokenHeaders = token ? { [AUTH_SERVICE_COOKIE_KEY]: `Bearer ${token}` } : {}

      try {
        const response = await axios(route, {
          paramsSerializer: (params) => {
            return stringify(params)
          },
          headers: { ...tokenHeaders, ...headers },
          params,
          httpAgent: HTTP_AGENT,
          data: payload,
          method,
          timeout: 30000
        })
        return response.data
      } catch (err) {
        const { response } = err
        if (!response) {
          throw new InternalServerErrorException(`${err}`)
        }
        const {
          status,
          data: { message }
        } = response
        throw new HttpException(message, status)
      }
    }
  }

  async getAccessToken(googleAccessToken: string) {
    const response = await this.request<IAccessToken>({
      resource: 'sessions',
      method: 'POST',
      payload: { googleAccessToken }
    })
    const { accessToken } = response
    return accessToken
  }

  async verifyToken(token: string) {
    let decodedTokenHeader: IJWTHeader
    try {
      decodedTokenHeader = jwt_decode(token, { header: true })
    } catch (err) {
      throw new UnauthorizedException(`decode auth token err: ${err}`)
    }
    const { kid = '' } = decodedTokenHeader
    if (!kid.length) {
      throw new UnauthorizedException('jwt header cid not found.')
    }

    let cachedCerts = await this.cacheManager.get<Record<string, string>>(AUTH_CERTS_CACHE_KEY)
    let publicKey = cachedCerts && cachedCerts[kid]
    if (!publicKey) {
      const response = await this.request<ICerts>({ resource: 'certs' })
      cachedCerts = response.certs
      await this.cacheManager.del(AUTH_CERTS_CACHE_KEY)
      await this.cacheManager.set(AUTH_CERTS_CACHE_KEY, cachedCerts, { ttl: FOREVER })
      publicKey = cachedCerts[kid]
    }
    try {
      const payload = jwt.verify(token, publicKey)
      return payload as IJWTPayLoad
    } catch (e) {
      throw new UnauthorizedException(e.message)
    }
  }

  async getAllTenants(token: string): Promise<ITenants> {
    const allTenants = await this.request<ITenants>({
      resource: 'tenants',
      params: {
        offset: 0,
        limit: 2000
      },
      token
    })
    return allTenants
  }

  async getTenantList(token: string, query: IListQuery): Promise<ITenants> {
    // TODO: auth server should support get all tenants api
    if (!query.limit) {
      query.limit = 2000
    }
    const allTenants = await this.request<ITenants>({
      resource: 'tenants',
      params: query,
      token
    })
    return allTenants
  }

  async getTenantByName(tenantName: string, token: string): Promise<ITenant> {
    const tenant = await this.request<ITenant>({
      resource: `tenants/names/${tenantName}`,
      token
    })
    return tenant
  }

  async createTenant(payload, token: string): Promise<ITenant> {
    const tenant = await this.request<ITenant>({
      resource: 'tenants',
      payload,
      method: 'POST',
      token
    })
    return tenant
  }

  async updateTenant(tenantId: number, payload, token: string): Promise<ITenant> {
    const tenant = await this.request<ITenant>({
      resource: `tenants/${tenantId}`,
      payload,
      method: 'PATCH',
      token
    })
    return tenant
  }

  async deleteTenant(tenantId: number, token: string): Promise<ITenant> {
    const tenant = await this.request<ITenant>({
      resource: `tenants/${tenantId}`,
      method: 'DELETE',
      token
    })
    return tenant
  }

  async getTenantById(tenantId: number, token: string) {
    const tenantKey = `tenant/${tenantId}`
    let tenantInfo = await this.cacheManager.get<ITenant>(tenantKey)
    if (!tenantInfo) {
      const newTenantInfo = await this.request<ITenant>({ resource: `tenants/${tenantId}`, token })
      await this.cacheManager.del(tenantKey)
      await this.cacheManager.set(tenantKey, newTenantInfo, { ttl: TWO_HOURS })
      tenantInfo = newTenantInfo
    }
    return tenantInfo
  }

  async getTenantUserList(tenantId: number, query, token: string) {
    const userList = await this.request<IUsers>({
      resource: `tenants/${tenantId}/users`,
      token,
      params: query
    })
    return userList
  }

  async addTenantUsers(tenantId: number, body, token: string) {
    const userList = await this.request<IUsers>({
      resource: `tenants/${tenantId}/users`,
      token,
      payload: body,
      method: 'POST'
    })
    return userList
  }

  async updateTenantUser(tenantId: number, userId: number, body, token: string) {
    const result = await this.request<IUsers>({
      resource: `tenants/${tenantId}/users/${userId}`,
      token,
      method: 'PATCH',
      payload: body
    })
    return result
  }

  async changeTenantUserRole(tenantId: number, userId: number, body, token: string) {
    const result = await this.request<IUsers>({
      resource: `tenants/${tenantId}/users/${userId}:changeRole`,
      token,
      method: 'POST',
      payload: body
    })
    return result
  }

  async deleteTenantUser(tenantId: number, userId: number, roleId: number, token: string) {
    const result = await this.request<IUsers>({
      resource: `tenants/${tenantId}/users/${userId}/roles/${roleId}`,
      token,
      method: 'DELETE'
    })
    return result
  }

  async getTenantBotList(tenantId: number, query, token: string) {
    const botList = await this.request<IBots>({
      resource: `tenants/${tenantId}/bots`,
      token,
      params: query
    })
    return botList
  }

  async addTenantBot(tenantId: number, body, token: string) {
    const bot = await this.request<IBot>({
      resource: `tenants/${tenantId}/bots`,
      token,
      payload: {
        bot: {
          name: body.name,
          password: body.password,
          detail: body.detail
        },
        roleId: body.roleId
      },
      method: 'POST'
    })
    return bot
  }

  async updateTenantBot(tenantId: number, botId: number, body, token: string) {
    const bot = await this.request<IBot>({
      resource: `tenants/${tenantId}/bots/${botId}`,
      token,
      payload: {
        bot: {
          name: body.name,
          password: body.password,
          detail: body.detail
        },
        roleId: body.roleId
      },
      method: 'PATCH'
    })
    return bot
  }

  async deleteTenantBot(tenantId: number, botId: number, token: string) {
    const result = await this.request({
      resource: `tenants/${tenantId}/bots/${botId}`,
      token,
      method: 'DELETE'
    })
    return result
  }

  async generateBotAccessToken(tenantId: number, botId: number, body, token: string) {
    const result = await this.request({
      resource: `tenants/${tenantId}/bots/${botId}/sessionKeys`,
      token,
      payload: body,
      method: 'POST'
    })
    return result
  }

  async getUserRoles(id: number, token: string) {
    const response = await this.request<IUserRoles>({ resource: `users/${id}/roles`, token })
    return response
  }

  async batchGetUsers(ids: number[], token: string): Promise<IBatchGetUsers> {
    const response = await this.request<any>({ resource: 'users:batchGet', token, params: { ids } })
    const users = response.users.map(({ userId, ...others }) => ({ id: userId, ...others }))
    return { users }
  }

  async batchGetTenants(ids: number[], token: string): Promise<IBatchGetTenants> {
    const response = await this.request<IBatchGetTenants>({ resource: 'tenants:batchGet', token, params: { ids } })
    return response
  }

  async getRolePermissions(roleId: number, token: string) {
    const roleKey = `role-${roleId}`

    let rolePermissions = await this.cacheManager.get<IPermissions>(roleKey)
    if (!rolePermissions) {
      const newPermissions = await this.request<IPermissions>({
        resource: `roles/${roleId}/permissions`,
        params: { offset: ES_DEFAULT_OFFSET, limit: ES_MAX_SEARCH_COUNT },
        token
      })
      await this.cacheManager.del(roleKey)
      await this.cacheManager.set(roleKey, newPermissions, { ttl: TWO_HOURS })
      rolePermissions = newPermissions
    }

    return rolePermissions
  }

  async getTenantRoles(tenantId: number, token: string) {
    const tenantRoles = await this.request<ITenantRoles>({
      resource: `tenants/${tenantId}/roles`,
      params: { offset: ES_DEFAULT_OFFSET, limit: ES_MAX_SEARCH_COUNT },
      token
    })

    return tenantRoles
  }

  async getTenantPermissions(roleBindings: IRoleBinding[], token: string): Promise<ITenantPermissions> {
    const tenantPermissions = {} as ITenantPermissions

    await Promise.all(
      roleBindings.map(async (roleBinding) => {
        const { permissions } = await this.getRolePermissions(roleBinding.roleId, token)

        const tenantId = roleBinding.tenantId

        tenantPermissions[tenantId] = permissions.reduce((prev, permission) => {
          const actions = prev[permission.resource] || []
          const env = PermissionEnvMap[permission.label]
          const envAction = env ? `${permission.action}${env}` : permission.action

          actions.push(envAction)
          prev[permission.resource] = actions
          return prev
        }, {} as Record<RESOURCE_TYPE, string[]>)
      })
    )

    return tenantPermissions
  }

  async getTenantPermisssionsWithPolicy(
    roleBindings: IRoleBinding[],
    token: string,
    source: string,
    effectiveSourceId: string
  ) {
    const tenantPermissions = await this.getTenantPermissions(roleBindings, token)
    const tenantPolicy = await Promise.all(
      roleBindings.map(async (roleBinding) => {
        const policy = await this.policyService.getPolicy(source, effectiveSourceId, roleBinding.roleId)
        return {
          tenantId: roleBinding.tenantId,
          policy
        }
      })
    )
    // eslint-disable-next-line array-callback-return
    tenantPolicy.map(({ tenantId, policy }) => {
      if (policy) {
        if (
          policy.effect === 'allow' &&
          Array.isArray(policy.actions) &&
          Array.isArray(tenantPermissions[tenantId][source])
        ) {
          // merge permission
          tenantPermissions[tenantId][source] = Array.from(
            new Set(policy.actions.concat(tenantPermissions[tenantId][source] || []))
          )
        }
        if (
          policy.effect === 'reject' &&
          Array.isArray(policy.actions) &&
          Array.isArray(tenantPermissions[tenantId][source])
        ) {
          // del policy actions
          tenantPermissions[tenantId][source] = (tenantPermissions[tenantId][source] as string[]).filter(
            (action) => !policy.actions.includes(action)
          )
        }
      }
    })
    return tenantPermissions
  }

  listTenantUserApprovers = async (tenantId: number, authToken: string) => {
    const approverList = await this.request<IApproverList>({
      resource: `tenants/${tenantId}/approvers`,
      token: authToken,
      params: { offset: ES_DEFAULT_OFFSET, limit: ES_MAX_SEARCH_COUNT, kind: 'user' }
    })

    return approverList
  }

  listTenantTerminalApprovers = async (tenantId: number, authToken: string) => {
    const approverList = await this.request<IApproverList>({
      resource: `tenants/${tenantId}/approvers`,
      token: authToken,
      params: { offset: ES_DEFAULT_OFFSET, limit: ES_MAX_SEARCH_COUNT, kind: 'terminal' }
    })

    return approverList
  }

  async getRoleById(roleId: number, authToken: string) {
    const roleKey = `role-info-${roleId}`

    let roleInfo = await this.cacheManager.get<IRoleBind>(roleKey)
    if (!roleInfo) {
      const newRoleInfo = await this.request<IRoleBind>({
        resource: `roles/${roleId}`,
        token: authToken
      })
      await this.cacheManager.del(roleKey)
      await this.cacheManager.set(roleKey, newRoleInfo, { ttl: TWO_HOURS })
      roleInfo = newRoleInfo
    }

    return roleInfo
  }

  async addTenantRole(tenantId: number, userId: number, payload: IAddRolePayload, authToken: string) {
    await this.request({
      resource: `tenants/${tenantId}/users/${userId}:addRole`,
      method: 'POST',
      payload,
      token: authToken
    })
  }

  async deleteTenantRole(tenantId: number, userId: number, roleId: number, authToken: string) {
    await this.request({
      resource: `tenants/${tenantId}/users/${userId}/roles/${roleId}`,
      method: 'DELETE',
      token: authToken
    })
  }

  async listVisibleTenants(authUser: IAuthUser, authToken: string) {
    const allTenants = await this.getAllTenants(authToken)
    const { tenants } = allTenants
    const { roles } = authUser

    let visibleTenants = tenants
    const isPlatformUser = roles.some(({ roleScope }) => roleScope === PLATFORM_ROLE_SCOPE)
    if (!isPlatformUser) {
      visibleTenants = tenants.filter(({ id }) => {
        return roles.some(({ tenantId }) => tenantId === id)
      })
    }

    return visibleTenants
  }

  public static hasTerminalPermission(role: IRoleBinding, tenantId: string): boolean {
    return (
      role.roleId === PERMISSION_GROUP.PLATFORM_ADMIN ||
      (role.tenantId === Number(tenantId) && role.roleId === PERMISSION_GROUP.TENANT_ADMIN)
    )
  }

  async getBotById(botId: number, token: string) {
    const botKey = `bots/${botId}`
    let botInfo = await this.cacheManager.get<IBotInfo>(botKey)
    if (!botInfo) {
      const newBotInfo = await this.request<IBotInfo>({ resource: `bots/${botId}`, token })
      await this.cacheManager.del(botKey)
      await this.cacheManager.set(botKey, newBotInfo, { ttl: FOREVER })
      botInfo = newBotInfo
    }
    return botInfo
  }
}
