import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import {
  RoleApplyTenantUserBodyDto,
  IInitialRequestPendingState,
  IAccessRequestDetail,
  INewTicketApplication,
  RoleApplyPlatformAdminBodyDto,
  IChangeRoleApplyRequestBodyDto,
  IChangeRoleApplyResponse
} from './dto/role.dto'

import { ESService } from 'common/modules/es/es.service'
import { MailerService } from 'common/modules/mailer/mailer.service'

import { ESIndex } from 'common/constants/es'
import { IUser } from 'users/entities/user.entity'
import {
  AUTH_STATUS,
  AUTH_TYPE,
  Groups,
  ROLES,
  WITH_SRE_GROUP,
  GroupInfo,
  AUTH_TYPE_WORDS
} from 'common/constants/auth'
import { APPROVAL_DETAIL_URL } from 'common/constants/request'
import { PLATFORM_TENANT_ID } from 'common/constants/rbac'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'
// import { IESRbacUser } from 'rbac/entities/rbac.entity'
import { AuthService } from 'common/modules/auth/auth.service'
import { IEsBooleanQuery } from 'common/interfaces'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name)

  constructor(
    private eSService: ESService,
    private mailerService: MailerService,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  async newUserApplyForTenantUser(
    info: RoleApplyTenantUserBodyDto,
    host: string,
    authToken: string,
    authUser: IAuthUser
  ) {
    const { tenantId, permissionGroupId } = info
    const { ID: userId, Email: userEmail } = authUser
    // checkout user if new user
    const userRoles = await this.authService.getUserRoles(userId, authToken)
    const { totalSize } = userRoles
    if (totalSize) {
      throw new BadRequestException('User have already registered')
    }

    // check if apply before
    const newUserTicket = await this.getLatestTicketFromEs({ userId, types: [AUTH_TYPE.ADD_ROLE] })
    if (
      newUserTicket &&
      (newUserTicket.status === AUTH_STATUS.PENDING || (newUserTicket.status === AUTH_STATUS.APPROVED && totalSize))
    ) {
      throw new BadRequestException('You have applied already!')
    }

    // check request tenantId and roleId is valid
    const requestTenant = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName, id: requestTenantId } = requestTenant

    const requestTenantRoles = await this.authService.getTenantRoles(tenantId, authToken)
    const { roles } = requestTenantRoles
    const requestRole = roles.find(({ id }) => id === permissionGroupId)
    if (!requestRole) {
      throw new BadRequestException(
        `Can't find request permissionGroupId ${permissionGroupId} in request tenant: ${tenantId}`
      )
    }
    const { name: roleName, id: roleId } = requestRole

    const approverList = await this.authService.listTenantUserApprovers(tenantId, authToken)
    const { users, totalSize: approverTotalSize } = approverList
    if (!approverTotalSize) {
      throw new NotFoundException('Approver not found!')
    }

    const ticketId = await this.createNewTicketApplication({
      type: AUTH_TYPE.ADD_ROLE,
      applicantId: userId,
      tenant: requestTenantId,
      permissionGroup: roleId
    })

    users.forEach(({ email }) => {
      this.mailerService.sendMail({
        subject: `${userEmail} 申请 kubernetes platform 权限`,
        to: email,
        text: `Hi, ${userEmail} 申请 kubernetes platform ${
          AUTH_TYPE_WORDS[AUTH_TYPE.ADD_ROLE]
        }（Tenant:${tenantName}, permissionGroup:${roleName})，请您访问 https://${host}/${APPROVAL_DETAIL_URL}/${ticketId} 进行审批`
      })
    })

    return {
      ticketId,
      approverList: users
    }
  }

  async newUserApplyForPlatformUser(
    info: RoleApplyPlatformAdminBodyDto,
    host: string,
    authToken: string,
    authUser: IAuthUser
  ) {
    const { purpose, permissionGroupId } = info
    const { ID: userId, Email: userEmail } = authUser
    // checkout user if new user
    const userRoles = await this.authService.getUserRoles(userId, authToken)
    const { totalSize } = userRoles
    if (totalSize) {
      throw new BadRequestException('User have already registered')
    }

    // check if apply before
    const newUserTicket = await this.getLatestTicketFromEs({ userId, types: [AUTH_TYPE.ADD_ROLE] })

    if (
      newUserTicket &&
      (newUserTicket.status === AUTH_STATUS.PENDING || (newUserTicket.status === AUTH_STATUS.APPROVED && totalSize))
    ) {
      throw new BadRequestException('You have applied already!')
    }

    const approverList = await this.authService.listTenantUserApprovers(PLATFORM_TENANT_ID, authToken)

    const { users, totalSize: approverTotalSize } = approverList

    if (!approverTotalSize) {
      throw new NotFoundException('Approver not found!')
    }
    const ticketId = await this.createNewTicketApplication({
      type: AUTH_TYPE.ADD_ROLE,
      applicantId: userId,
      tenant: PLATFORM_TENANT_ID,
      permissionGroup: permissionGroupId,
      purpose
    })

    const roleInfo = await this.authService.getRoleById(permissionGroupId, authToken)
    users.forEach(({ email }) => {
      this.mailerService.sendMail({
        subject: `${userEmail} 申请 kubernetes platform 权限`,
        to: email,
        text: `Hi, ${userEmail} 申请 kubernetes platform ${AUTH_TYPE_WORDS[AUTH_TYPE.ADD_ROLE]}（permissionGroup:${
          roleInfo.name
        })，
        请您访问 https://${host}/${APPROVAL_DETAIL_URL}/${ticketId} 进行审批`
      })
    })

    return {
      ticketId,
      approverList: users
    }
  }

  async changeRole(
    info: IChangeRoleApplyRequestBodyDto,
    authUser: IAuthUser,
    host: string,
    authToken: string
  ): Promise<IChangeRoleApplyResponse> {
    const { roles } = info
    const { ID: userId, Email: applicantEmail, roles: currentRoles } = authUser

    // filter out changed roles
    const noChangedRoles = []
    const changedRoles = roles.filter((role) => {
      const { tenantId: requestTenantId, permissionGroupId: requestPermissionGroupId } = role
      const isNoChanged = currentRoles.some(
        ({ tenantId, roleId }) => requestTenantId === tenantId && requestPermissionGroupId === roleId
      )
      if (isNoChanged) {
        noChangedRoles.push(role)
      }
      return !isNoChanged
    })

    if (!changedRoles.length) {
      throw new BadRequestException('You have the requested roles already!')
    }

    // checkout same apply
    const requestRoleMap = {}
    changedRoles.forEach(({ tenantId, permissionGroupId }) => {
      const roleKey = `${tenantId}-${permissionGroupId}`
      if (!requestRoleMap[roleKey]) {
        requestRoleMap[roleKey] = 0
      } else {
        throw new BadRequestException('Can not apply the same permission group twice!')
      }
    })

    // checkout user if new user
    const userRoles = await this.authService.getUserRoles(userId, authToken)
    const { totalSize } = userRoles
    if (!totalSize) {
      throw new BadRequestException('New user can not change role, please add a new role first!')
    }

    // check if last apply not being approved
    const { isRoleRequestPending } = await this.isRoleRequestPending(authUser)
    if (isRoleRequestPending) {
      throw new BadRequestException('Your last role apply has not being approved!')
    }

    // check approvers not empty
    const tenantApproversMap = {}
    await Promise.all(
      changedRoles.map(async ({ tenantId }) => {
        const approverList = await this.authService.listTenantUserApprovers(tenantId, authToken)
        const { users, totalSize: approverTotalSize } = approverList
        if (!approverTotalSize) {
          throw new NotFoundException(`Tenant ${tenantId} approver not found!`)
        }

        tenantApproversMap[tenantId] = users
      })
    )

    // find change roles
    const applyTypeRolesMap = {
      [AUTH_TYPE.CHANGE_ROLE]: [],
      [AUTH_TYPE.ADD_ROLE]: []
    }
    changedRoles.forEach((requestRole) => {
      const { tenantId } = requestRole
      const isChangeTenantRole = currentRoles.some(({ tenantId: currentTenantId }) => tenantId === currentTenantId)
      if (isChangeTenantRole) {
        applyTypeRolesMap[AUTH_TYPE.CHANGE_ROLE].push(requestRole)
      } else {
        applyTypeRolesMap[AUTH_TYPE.ADD_ROLE].push(requestRole)
      }
    })

    // create tickets
    const applyTypeTickets = await Promise.all(
      Object.entries(applyTypeRolesMap).map(async ([applyType, roles]) => {
        const ticketList = await Promise.all(
          roles.map(async ({ tenantId, permissionGroupId }) => {
            const roleInfo = await this.authService.getRoleById(permissionGroupId, authToken)
            const { name: permissionGroupName } = roleInfo
            const requestTenant = await this.authService.getTenantById(tenantId, authToken)
            const { name: tenantName, id: requestTenantId } = requestTenant

            const ticketId = await this.createNewTicketApplication({
              type: applyType as AUTH_TYPE,
              applicantId: userId,
              tenant: requestTenantId,
              permissionGroup: permissionGroupId
            })

            const approvers = tenantApproversMap[tenantId] || []
            approvers.forEach(({ email }) => {
              this.mailerService.sendMail({
                subject: `${applicantEmail} 申请 kubernetes platform 权限`,
                to: email,
                text: `Hi, ${applicantEmail} 申请 kubernetes platform ${AUTH_TYPE_WORDS[applyType]}（tenant: ${tenantName}, permissionGroup:${permissionGroupName})，
                请您访问 https://${host}/${APPROVAL_DETAIL_URL}/${ticketId} 进行审批`
              })
            })

            return {
              tenantName,
              tenantId,
              permissionGroupName,
              permissionGroupId,
              ticketId,
              approverList: approvers
            }
          })
        )

        return ticketList
      })
    )

    // delete old roles
    await Promise.all(
      currentRoles.map(async ({ tenantId, roleId }) => {
        const remainedOldRole = noChangedRoles.some(
          ({ tenantId: noChangedTenantId, permissionGroupId: noChangedRoleId }) =>
            tenantId === noChangedTenantId && noChangedRoleId === roleId
        )

        if (!remainedOldRole) {
          await this.authService.deleteTenantUser(tenantId, userId, roleId, authToken)
        }
      })
    )

    const flattedTickets = applyTypeTickets.reduce((flatArray, cur) => {
      flatArray.push(...cur)
      return flatArray
    }, [])

    return {
      tickets: flattedTickets
    }
  }

  async isRoleRequestPending(authUser: IAuthUser) {
    const { ID: userId } = authUser

    const { documents } = await this.eSService.booleanQueryAll<IAccessRequestDetail>(
      ESIndex.TICKET,
      {
        must: [
          {
            term: { applicant: userId }
          },
          {
            terms: { type: [AUTH_TYPE.ADD_ROLE, AUTH_TYPE.CHANGE_ROLE] }
          }
        ]
      },
      undefined,
      undefined,
      ['createdAt:desc']
    )

    const isRoleRequestPending = documents.some(({ status }) => status === AUTH_STATUS.PENDING)

    return { isRoleRequestPending }
  }

  async latestNewUserTicketStatus(userId: number, authToken: string): Promise<IInitialRequestPendingState> {
    try {
      const lastedTicket: any = await this.getLatestTicketFromEs({
        userId,
        types: [AUTH_TYPE.ADD_ROLE, AUTH_TYPE.CHANGE_ROLE]
      })

      if (!lastedTicket) {
        return { status: 'NOTFOUND' as AUTH_STATUS, ticketId: '', approver: '' }
      }

      const { status, id: ticketId, approver } = lastedTicket

      const result: any = { status: status as AUTH_STATUS, ticketId, approver }
      if (status === AUTH_STATUS.PENDING) {
        const tenantId = lastedTicket.tenant
        const approverList = await this.authService.listTenantUserApprovers(tenantId, authToken)
        const { users, totalSize: approverTotalSize } = approverList
        if (!approverTotalSize) {
          throw new NotFoundException(`Tenant ${tenantId} approver not found!`)
        }
        result.users = users
      }
      return result
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async getRbacUserInfo(email: string) {
    try {
      const rbacUser = await this.eSService.termQueryFirst<any>(ESIndex.RBAC, 'email', email)
      return rbacUser || {}
    } catch (err) {
      this.logger.error(`Search RBAC ES error: ${err}, email: ${email}`)
      throw new BadRequestException(`ES Service error: ${err}`)
    }
  }

  validateGroupAndRole(realGroup, role) {
    const group = Groups[realGroup]
    const groupInfo = GroupInfo[group]

    if (!group || !groupInfo) {
      throw new BadRequestException('Invalid group type')
    }
    // 只有 TechOps Group 才有SRE的角色
    if (!ROLES[role] || (role === ROLES.SRE && realGroup !== WITH_SRE_GROUP)) {
      throw new BadRequestException('Invalid role type')
    }

    return { group, groupInfo }
  }

  private async createNewTicketApplication({
    type,
    applicantId,
    tenant,
    permissionGroup,
    purpose
  }: INewTicketApplication) {
    // 创建新的申请，提交到es
    const booleanQueryParams: IEsBooleanQuery = {
      must: [
        {
          term: {
            type
          }
        }
      ]
    }
    const totalCount = await this.eSService.count(ESIndex.TICKET, booleanQueryParams)

    const now = new Date(Date.now())
    const formatType = type.split('_').reduce((acc, curr) => {
      return acc + curr.charAt(0) + curr.substring(1).toLowerCase()
    }, '')
    const displayId = `ECP${formatType}-${(totalCount + 1).toString().padStart(6, '0')}`
    const newUserApplication = {
      displayId,
      type,
      applicant: applicantId,
      tenant,
      permissionGroup,
      purpose,
      status: AUTH_STATUS.PENDING,
      createdAt: now.toISOString()
    }
    let id = ''
    try {
      const { _id } = await this.eSService.index(ESIndex.TICKET, newUserApplication)
      id = _id
    } catch (err) {
      throw new BadRequestException(`ES Service error: ${err}`)
    }

    return id
  }

  private async checkIfHavePendingRequest({ email, type }) {
    const { total } = await this.eSService.booleanQueryAll<IUser>(ESIndex.AUTH_V2, {
      must: [
        {
          term: { email }
        },
        {
          term: { type }
        },
        {
          term: { status: AUTH_STATUS.PENDING }
        }
      ]
    })

    return total > 0
  }

  private async getLatestTicketFromEs({ userId, types }): Promise<IAccessRequestDetail> {
    const parseHits = (hits) => {
      return hits.map((hit) => {
        const { _id, _source } = hit
        return { id: _id, ..._source }
      })
    }

    const { total, documents } = await this.eSService.booleanQueryAll<IAccessRequestDetail>(
      ESIndex.TICKET,
      {
        must: [
          {
            term: { applicant: userId }
          },
          {
            terms: { type: types }
          }
        ]
      },
      undefined,
      undefined,
      ['createdAt:desc'],
      parseHits
    )

    if (total !== 0) {
      return documents[0]
    }
  }
}
