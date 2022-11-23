import {
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { ITenant } from 'applications-management/groups/dto/group.dto'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { ESIndex, ES_DEFAULT_COUNT, ES_DEFAULT_OFFSET } from 'common/constants/es'
import { RESOURCE_ACTION, RESOURCE_TYPE, PLATFORM_TENANT_ID } from 'common/constants/rbac'
import { APPROVAL_DETAIL_URL, REQUEST_DETAIL_URL } from 'common/constants/request'
import { TICKET_TYPE, TICKET_STATUS } from 'common/constants/ticket'
import { AUTH_TYPE_WORDS, AUTH_STATUS, AUTH_TYPE } from 'common/constants/auth'

import { IAuthUser } from 'common/decorators/parameters/AuthUser'
import { parseFiltersMap } from 'common/helpers/filter'
import { IEsBooleanQuery } from 'common/interfaces'
import { IApprover, IRoleBind, IUser } from 'common/interfaces/authService.interface'
import { AuthService } from 'common/modules/auth/auth.service'
import { ESService } from 'common/modules/es/es.service'
import { MailerService } from 'common/modules/mailer/mailer.service'

import {
  IListTicketsQueryDto,
  IListMyTickets,
  STATUS_TYPE,
  IListTicketsResponse,
  ITicket,
  ITicketDetail,
  IMyTickets
} from './dto/ticket.dto'
import { IESTicket } from './entities/ticket.entity'

@Injectable()
export class TicketService {
  constructor(
    private readonly esService: ESService,
    private readonly authService: AuthService,
    private readonly projectsService: ProjectsService,
    private readonly mailerService: MailerService
  ) {}

  async listMyApproverPendingTickets(
    authUser: IAuthUser,
    authToken: string,
    { orderBy, offset, limit }: IListTicketsQueryDto
  ): Promise<IListTicketsResponse> {
    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    const booleanQueryParams: IEsBooleanQuery = {
      should: []
    }

    const validTenantPermissions = Object.entries(tenantPermissions).filter(([tenantId, tenantResourcePermissions]) => {
      // filter out global user apply if user have no permission to approve access ticket
      if (Number(tenantId) === PLATFORM_TENANT_ID) {
        const accessTicketPermissions = tenantResourcePermissions[RESOURCE_TYPE.ACCESS_TICKET] || []
        return accessTicketPermissions.includes(RESOURCE_ACTION.Approve)
      }
      return true
    })

    validTenantPermissions.forEach(([tenantId, tenantResourcePermissions]) => {
      const userPermissions = tenantResourcePermissions[RESOURCE_TYPE.TENANT_USER] || []

      if (userPermissions.includes(RESOURCE_ACTION.Add)) {
        const query: IEsBooleanQuery = {
          must: []
        }
        query.must.push(
          {
            terms: {
              type: [TICKET_TYPE.ADD_ROLE, TICKET_TYPE.CHANGE_ROLE]
            }
          },
          {
            term: {
              tenant: tenantId
            }
          },
          {
            term: {
              status: TICKET_STATUS.PENDING
            }
          }
        )
        booleanQueryParams.should.push({
          bool: query
        })
      }

      const terminalPermissions = tenantResourcePermissions[RESOURCE_TYPE.POD_TERMINAL] || []

      if (terminalPermissions.includes(RESOURCE_ACTION.ApproveLive)) {
        const query: IEsBooleanQuery = {
          must: []
        }
        query.must.push(
          {
            terms: {
              type: [TICKET_TYPE.TERMINAL]
            }
          },
          {
            term: {
              tenant: tenantId
            }
          },
          {
            term: {
              status: TICKET_STATUS.PENDING
            }
          }
        )
        booleanQueryParams.should.push({
          bool: query
        })
      }
    })

    if (!booleanQueryParams.should.length) {
      return {
        tickets: [],
        totalCount: 0
      }
    }

    return await this.queryTickets(booleanQueryParams, orderBy, offset, limit, authToken)
  }

  async listMyApproverHistoryTickets(
    authUser: IAuthUser,
    authToken: string,
    { orderBy, offset, limit }: IListTicketsQueryDto
  ) {
    const booleanQueryParams: IEsBooleanQuery = {
      must: [
        {
          term: {
            approver: authUser.ID
          }
        }
      ],
      mustNot: [
        {
          term: {
            status: TICKET_STATUS.PENDING
          }
        }
      ]
    }

    return await this.queryTickets(booleanQueryParams, orderBy, offset, limit, authToken)
  }

  async listMyTickets(
    authUser: IAuthUser,
    authToken,
    { orderBy, offset, filterBy, limit, statusType }: IListMyTickets
  ): Promise<IMyTickets> {
    const booleanQueryParams: IEsBooleanQuery = {
      must: [
        {
          term: {
            applicant: authUser.ID
          }
        }
      ]
    }
    const totalCount = await this.esService.count(ESIndex.TICKET, booleanQueryParams)

    const pendingBooleanQuery = {
      must: [
        {
          term: {
            applicant: authUser.ID
          }
        },
        {
          term: {
            status: AUTH_STATUS.PENDING
          }
        }
      ]
    }
    const pendingCount = await this.esService.count(ESIndex.TICKET, pendingBooleanQuery)

    const finishedBooleanQuery = {
      must: [
        {
          term: {
            applicant: authUser.ID
          }
        },
        {
          terms: {
            status: [AUTH_STATUS.APPROVED, AUTH_STATUS.REJECTED, AUTH_STATUS.CANCELLED]
          }
        }
      ]
    }
    const finishedCount = await this.esService.count(ESIndex.TICKET, finishedBooleanQuery)

    const statusMap = {
      [STATUS_TYPE.Pending]: [AUTH_STATUS.PENDING],
      [STATUS_TYPE.Finished]: [AUTH_STATUS.APPROVED, AUTH_STATUS.REJECTED, AUTH_STATUS.CANCELLED]
    }

    if (statusType !== STATUS_TYPE.All) {
      booleanQueryParams.must.push({
        terms: {
          status: statusMap[statusType]
        }
      })
    }

    const filterObject = parseFiltersMap(filterBy)
    const { status = [] } = filterObject

    if (status.length) {
      booleanQueryParams.must.push({
        terms: {
          status
        }
      })
    }

    const requestTickets = await this.queryTickets(booleanQueryParams, orderBy, offset, limit, authToken)

    return {
      totalCount,
      pendingCount,
      finishedCount,
      tickets: requestTickets.tickets
    }
  }

  async queryTickets(query: IEsBooleanQuery, orderBy, offset, limit, authToken): Promise<IListTicketsResponse> {
    const sort = []
    // TODO need a general way to handle orderBy filter
    if (!orderBy) {
      sort.push('createdAt:desc')
    } else {
      const orderKey = orderBy.split(' ')
      if (orderKey.length === 1) {
        sort.push(orderKey[0])
      } else {
        sort.push(`${orderKey[0]}:${orderKey[1]}`)
      }
    }

    limit = limit || ES_DEFAULT_COUNT
    offset = offset || ES_DEFAULT_OFFSET

    const parseHits = (hits) => {
      return hits.map((hit) => {
        const { _id, _source } = hit
        return { id: _id, ..._source }
      })
    }

    const { total, documents } = await this.esService.booleanQueryAll<IESTicket>(
      ESIndex.TICKET,
      query,
      limit,
      offset,
      sort,
      parseHits
    )

    const response = {} as IListTicketsResponse
    const userIds = new Set<number>()
    documents.forEach((document) => {
      userIds.add(document.applicant)
      if (document.approver) {
        userIds.add(document.approver)
      }
    })
    const tenantIds = new Set<number>()
    documents.forEach((document) => {
      if (document.tenant) {
        tenantIds.add(document.tenant)
      }
    })

    const roles: IRoleBind[] = []
    let users: IUser[] = []
    let tenants: ITenant[] = []

    await Promise.all([
      (async () => {
        const response = await this.authService.batchGetUsers(Array.from(userIds), authToken)
        users = response.users
      })(),
      (async () => {
        if (Array.from(tenantIds).length < 1) return
        const response = await this.authService.batchGetTenants(Array.from(tenantIds), authToken)
        tenants = response.tenants
      })(),
      (async () => {
        const rolesSet = await Promise.all(
          Array.from(tenantIds).map(async (tenantId) => {
            const { roles } = await this.authService.getTenantRoles(tenantId, authToken)
            return roles
          })
        )

        rolesSet.forEach((_roles) => {
          _roles.forEach((_role) => {
            if (!roles.find((role) => role.id === _role.id)) {
              roles.push(_role)
            }
          })
        })
      })()
    ])
    response.tickets = documents.map((document) => {
      const ticket = {
        displayId: document.displayId,
        id: document.id,
        type: document.type,
        status: document.status,
        project: document.project || '',
        purpose: document.purpose || '',
        createdAt: document.createdAt,
        updatedAt: document.updatedAt || ''
      } as ITicket
      const applicantUser = users.find(({ id }) => id === document.applicant)
      const approverUser = users.find(({ id }) => id === document.approver)
      const tenant = tenants.find(({ id }) => id === document.tenant)
      const role = roles.find(({ id }) => id === document.permissionGroup)
      ticket.applicant = applicantUser || ({} as IUser)
      ticket.approver = approverUser || ({} as IUser)
      ticket.tenant = tenant || ({} as ITenant)
      ticket.permissionGroup = role

      return ticket
    })

    response.totalCount = total
    return response
  }

  async getTicketById(ticketId: string, authToken: string): Promise<ITicketDetail> {
    const ticket = await this.esService.getById<IESTicket>(ESIndex.TICKET, ticketId)
    if (!ticket) {
      throw new NotFoundException(`Request ticket ${ticketId} not found!`)
    }
    const {
      type,
      applicant: applicantId,
      approver,
      createdAt,
      updatedAt = '',
      tenant: tenantId,
      permissionGroup: permissionGroupId,
      purpose = '',
      status,
      project = ''
    } = ticket
    const requestTenantId = Number(tenantId)
    const isPlatformAdmin = requestTenantId === PLATFORM_TENANT_ID
    let tenantName = ''
    if (!isPlatformAdmin) {
      const tenantInfo = await this.authService.getTenantById(requestTenantId, authToken)
      tenantName = tenantInfo.name
    }
    let permissionGroupInfo: any = {}
    if (permissionGroupId) {
      permissionGroupInfo = await this.authService.getRoleById(Number(permissionGroupId), authToken)
    }

    let approverName = ''
    if (approver) {
      const userInfo = await this.authService.batchGetUsers([approver], authToken)
      const approverInfo = userInfo.users[0]
      approverName = approverInfo.name
    }
    let approverList: IApprover[] = []
    if (status === AUTH_STATUS.PENDING) {
      const requestFunc =
        type === AUTH_TYPE.TERMINAL
          ? this.authService.listTenantTerminalApprovers
          : this.authService.listTenantUserApprovers
      const response = await requestFunc(requestTenantId, authToken)
      const { users, totalSize: approverTotalSize } = response
      if (!approverTotalSize) {
        throw new NotFoundException(`Tenant ${tenantId} approver not found!`)
      }
      approverList = users
    }

    const applicantInfo = await this.authService.batchGetUsers([applicantId], authToken)
    const { name: applicantName, email: applicantEmail } = applicantInfo.users[0] || {}

    const { name: permissionGroupName = '' } = permissionGroupInfo

    const ticketDetail: ITicketDetail = {
      type,
      applicantName: applicantName || '',
      applicantEmail,
      applicantId: Number(applicantId),
      tenantName: tenantName,
      tenantId: Number(tenantId),
      permissionGroupName,
      permissionGroupId: Number(permissionGroupId),
      appliedTime: createdAt,
      status,
      project,
      purpose,
      approvedTime: '',
      cancelledTime: '',
      approver: approverName,
      approverList
    }
    if (status === AUTH_STATUS.CANCELLED) {
      ticketDetail.cancelledTime = updatedAt
    } else {
      ticketDetail.approvedTime = updatedAt
    }
    return ticketDetail
  }

  /**
   * only applicant can delete pending tickets
   * @param ticketId
   * @param authUser
   * @returns
   */
  async cancelTicket(ticketId: string, authUser: IAuthUser) {
    const { ID: currentUserId } = authUser
    const ticket = await this.esService.getById<IESTicket>(ESIndex.TICKET, ticketId)
    const { applicant, status } = ticket
    if (applicant !== currentUserId) {
      throw new ForbiddenException('You do not have permission to cancel this ticket!')
    }
    if (status !== TICKET_STATUS.PENDING) {
      throw new ForbiddenException('Only pending ticket can be cancel!')
    }

    try {
      const newTicketStatus = {
        status: TICKET_STATUS.CANCELLED,
        updatedAt: new Date(Date.now())
      }
      await this.esService.update(ESIndex.TICKET, ticketId, newTicketStatus)
      return {}
    } catch (err) {
      throw new InternalServerErrorException(`Fail to delete bot for: ${err}. operator: ${authUser}`)
    }
  }

  async approveTicket(ticketId: string, authToken: string, authUser: IAuthUser, host: string) {
    const { ID, roles: currentRoles } = authUser

    const ticketInfo = await this.esService.getById<IESTicket>(ESIndex.TICKET, ticketId)
    if (ticketInfo === null) {
      throw new NotFoundException('Ticket not found!')
    }
    const {
      applicant: applicantId,
      tenant: tenantId,
      permissionGroup: permissionGroupId,
      type,
      project,
      status
    } = ticketInfo
    if (status !== AUTH_STATUS.PENDING) {
      throw new NotFoundException('Ticket is not pending!')
    }

    const requestTenantId = Number(tenantId)
    const isPlatformAdmin = requestTenantId === PLATFORM_TENANT_ID
    let tenantName = ''
    if (!isPlatformAdmin) {
      const tenantInfo = await this.authService.getTenantById(requestTenantId, authToken)
      tenantName = tenantInfo.name
    }

    let permissionGroupDetail: any = {}
    if (permissionGroupId) {
      permissionGroupDetail = await this.authService.getRoleById(permissionGroupId, authToken)
    }
    const { name: permissionGroupName } = permissionGroupDetail

    const oldRoleInfo = currentRoles.find(({ tenantId: oldTenantId }) => oldTenantId === permissionGroupId)

    if (type === AUTH_TYPE.ADD_ROLE || type === AUTH_TYPE.CHANGE_ROLE) {
      // delete old role
      try {
        await this.authService.deleteTenantRole(
          Number(oldRoleInfo.tenantId),
          Number(applicantId),
          Number(oldRoleInfo.roleId),
          authToken
        )
      } catch (err) {
        // ignore delete error
      }

      // add new role
      await this.authService.addTenantRole(
        tenantId,
        Number(applicantId),
        { roleId: permissionGroupDetail.id },
        authToken
      )
    }

    const now = new Date(Date.now())
    const newStatus = TICKET_STATUS.APPROVED
    const newTicketStatus = {
      status: newStatus,
      approver: ID,
      updatedAt: now
    }
    try {
      await this.esService.update(ESIndex.TICKET, ticketId, newTicketStatus)
    } catch (err) {
      throw new InternalServerErrorException(`Approve ES status error: ${err}`)
    }
    const userInfo = await this.authService.batchGetUsers([Number(applicantId)], authToken)
    const { users } = userInfo
    if (!users.length) {
      throw new NotFoundException('Applicant info not found!')
    }
    const { email: applicantEmail } = users[0]

    const subject = `申请 kubernetes platform 权限审批结果[${newStatus}]`
    const roleChangeText = `Hi, 您申请了 kubernetes platform ${AUTH_TYPE_WORDS[type]} Tenant:${tenantName}, permissionGroup:${permissionGroupName})，审批结果为[${newStatus}],请访问 https://${host}/${REQUEST_DETAIL_URL}/${ticketId} 查看详情`
    const terminalText = `Hi, 您申请了 kubernetes platform ${AUTH_TYPE_WORDS.TERMINAL} Tenant:${tenantName}, project:${project})，审批结果为[${newStatus}],请访问 https://${host}/${REQUEST_DETAIL_URL}/${ticketId} 查看详情`
    const textMap = {
      [AUTH_TYPE.ADD_ROLE]: roleChangeText,
      [AUTH_TYPE.CHANGE_ROLE]: roleChangeText,
      [AUTH_TYPE.TERMINAL]: terminalText
    }

    this.mailerService.sendMail({ subject, to: applicantEmail, text: textMap[type] })
  }

  async rejectTicket(ticketId: string, authToken: string, authUser: IAuthUser, host: string) {
    const ticketInfo = await this.esService.getById<IESTicket>(ESIndex.TICKET, ticketId)
    if (ticketInfo === null) {
      throw new NotFoundException('Ticket not found!')
    }
    const {
      applicant: applicantId,
      tenant: tenantId,
      permissionGroup: permissionGroupId,
      type,
      project,
      status
    } = ticketInfo
    if (status !== AUTH_STATUS.PENDING) {
      throw new NotFoundException('Ticket is not pending!')
    }
    const requestTenantId = Number(tenantId)
    const isPlatformAdmin = requestTenantId === PLATFORM_TENANT_ID
    let tenantName = ''
    if (!isPlatformAdmin) {
      const tenantInfo = await this.authService.getTenantById(requestTenantId, authToken)
      tenantName = tenantInfo.name
    }

    let permissionGroupDetail: any = {}
    if (permissionGroupId) {
      permissionGroupDetail = await this.authService.getRoleById(permissionGroupId, authToken)
    }
    const { name: permissionGroupName = '' } = permissionGroupDetail

    const { ID } = authUser
    const now = new Date(Date.now())
    const newStatus = TICKET_STATUS.REJECTED
    const newTicketStatus = {
      status: newStatus,
      approver: ID,
      updatedAt: now
    }
    try {
      await this.esService.update(ESIndex.TICKET, ticketId, newTicketStatus)
    } catch (err) {
      throw new InternalServerErrorException(`Reject ES status error: ${err}`)
    }
    const userInfo = await this.authService.batchGetUsers([Number(applicantId)], authToken)
    const { users } = userInfo
    if (!users.length) {
      throw new NotFoundException('Applicant info not found!')
    }
    const { email: applicantEmail } = users[0]

    const subject = `申请 kubernetes platform 权限审批结果[${newStatus}]`
    const roleChangeText = `Hi, 您申请了 kubernetes platform ${AUTH_TYPE_WORDS[newStatus]}Tenant:${tenantName}, permissionGroup:${permissionGroupName})，审批结果为[${newStatus}],请访问 https://${host}/${REQUEST_DETAIL_URL}/${ticketId} 查看详情`
    const terminalText = `Hi, 您申请了 kubernetes platform ${AUTH_TYPE_WORDS.TERMINAL} Tenant:${tenantName}, project:${project})，审批结果为[${newStatus}],请访问 https://${host}/${REQUEST_DETAIL_URL}/${ticketId} 查看详情`
    const textMap = {
      [AUTH_TYPE.ADD_ROLE]: roleChangeText,
      [AUTH_TYPE.CHANGE_ROLE]: roleChangeText,
      [AUTH_TYPE.TERMINAL]: terminalText
    }
    this.mailerService.sendMail({ subject, to: applicantEmail, text: textMap[type] })
  }

  async applyTerminalAccess({
    tenant,
    project,
    info,
    authUser,
    host,
    authToken
  }: {
    tenant: number
    project: string
    info: { reason: string }
    authUser: IAuthUser
    host: string
    authToken: string
  }) {
    // validate projectName and groupName
    await this.projectsService.getEsProject(project, tenant)

    const ticketQueryParam = {
      must: [
        {
          term: { tenant: Number(tenant) }
        },
        {
          term: { project }
        },
        {
          term: { applicant: authUser.ID }
        }
      ]
    }

    const latestRequest = await this.esService.booleanQueryFirst<IESTicket>(
      ESIndex.TICKET,
      ticketQueryParam,
      undefined,
      ['updatedAt:desc']
    )

    // 校验该用户是否已经提交申请
    if (latestRequest && latestRequest.status === TICKET_STATUS.PENDING) {
      throw new ConflictException('You have pending ticket needs to be processed first')
    }
    // 校验上次申请是否过期
    if (latestRequest && latestRequest.status === TICKET_STATUS.APPROVED) {
      const updateTimeMS = new Date(latestRequest.updatedAt).getTime()
      const nowMS = new Date().getTime()
      const expiredMS = 4 * 60 * 60 * 1000 // 4小时过期
      if (nowMS - updateTimeMS < expiredMS) {
        throw new ConflictException('Your last request is still effective, no need to apply a new one')
      }
    }

    const terminalApprovers = await this.authService.listTenantTerminalApprovers(Number(tenant), authToken)
    const { users: approvers, totalSize } = terminalApprovers

    if (!totalSize) {
      throw new NotFoundException('Terminal approvers not found!')
    }

    const booleanQueryParams: IEsBooleanQuery = {
      must: [
        {
          term: {
            type: TICKET_TYPE.TERMINAL
          }
        }
      ]
    }
    const totalCount = await this.esService.count(ESIndex.TICKET, booleanQueryParams)
    const now = new Date(Date.now())
    const formatType = TICKET_TYPE.TERMINAL.charAt(0) + TICKET_TYPE.TERMINAL.substring(1).toLowerCase()
    const displayId = `ECP${formatType}-${(totalCount + 1).toString().padStart(6, '0')}`
    const newTicket = {
      displayId,
      type: TICKET_TYPE.TERMINAL,
      tenant: Number(tenant),
      project,
      applicant: authUser.ID,
      purpose: info.reason,
      status: TICKET_STATUS.PENDING,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    } as IESTicket

    let id = ''
    try {
      const { _id } = await this.esService.index(ESIndex.TICKET, newTicket)
      id = _id
    } catch (err) {
      throw new BadRequestException(`ES Service error: ${err}`)
    }

    approvers.forEach(({ email }) => {
      this.mailerService.sendMail({
        subject: `${authUser.Email} 申请 kubernetes platform LIVE 容器的登陆权限`,
        to: email,
        text: `Hi, ${authUser.Email} 申请 kubernetes [project: ${project}] LIVE环境的容器登陆权限,\n申请理由：${
          info.reason || '--'
        }\n请您访问 https://${host}/${APPROVAL_DETAIL_URL}/${id} 进行审批`
      })
    })

    return newTicket
  }
}
