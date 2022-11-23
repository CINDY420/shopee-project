import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common'
import * as moment from 'moment'

import { RequestDetailResponseDto, RequestListResponseDto, RequestListItem, IESTicket } from './dto/requests.dto'

import { IAuthUser } from 'common/decorators/parameters/AuthUser'

import { ESService } from 'common/modules/es/es.service'
import { RoleService } from 'userRole/role.service'
import { MailerService } from 'common/modules/mailer/mailer.service'
import { ProjectsService } from 'applications-management/projects/projects.service'

import { IEsBooleanQuery } from 'common/interfaces'
import { APPROVAL_DETAIL_URL, REQUEST_DETAIL_URL } from 'common/constants/request'

import { ESIndex, ES_MAX_SEARCH_COUNT } from 'common/constants/es'
import { AUTH_STATUS, AUTH_TYPE, GroupInfo, AUTH_TYPE_WORDS } from 'common/constants/auth'
import { ACCESS_CONTROL_VERBS, GROUP_RESOURCES } from 'common/constants/rbac'
import { ERROR_MESSAGE } from 'common/constants/error'
import { IRbacUser } from 'rbac/entities/rbac.entity'
import { Logger } from 'common/helpers/logger'

enum requestTypes {
  ALL = 'All',
  PENDING = 'Pending',
  FINISHED = 'Finished'
}

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name)

  constructor(
    private eSService: ESService,
    private mailerService: MailerService,
    private roleService: RoleService,
    private projectsService: ProjectsService
  ) {}

  async applyAccess({ groupName, projectName, info, authUser, host }) {
    // validate projectName and groupName
    await this.projectsService.getEsProject(projectName, groupName)

    const authQueryParam = {
      must: [
        {
          term: { group: groupName }
        },
        {
          term: { requireres: projectName }
        },
        {
          term: { name: authUser.name }
        }
      ]
    }

    const latestRequest = await this.eSService.booleanQueryFirst<RequestDetailResponseDto>(
      ESIndex.AUTH_V2,
      authQueryParam,
      undefined,
      ['updatetime:desc']
    )

    // 校验该用户是否已经提交申请
    if (latestRequest && latestRequest.status === AUTH_STATUS.PENDING) {
      throw new ConflictException('User do not need to apply again')
    }
    // 校验上次申请是否过期
    if (latestRequest && latestRequest.status === AUTH_STATUS.APPROVED) {
      const updateTimeMS = new Date(latestRequest.updatetime).getTime()
      const nowMS = new Date().getTime()
      const expiredMS = 4 * 60 * 60 * 1000 // 4小时过期
      if (nowMS - updateTimeMS < expiredMS) {
        throw new ConflictException('Access within 4hours request')
      }
    }

    const now = new Date(Date.now())
    const newAuth = {
      group: groupName,
      requireres: projectName,
      email: authUser.email,
      name: authUser.name,
      reason: info.reason,
      status: AUTH_STATUS.PENDING,
      createtime: now.toISOString(),
      updatetime: now.toISOString()
    }

    let id = ''
    try {
      const { _id } = await this.eSService.index(ESIndex.AUTH_V2, newAuth)
      id = _id
    } catch (err) {
      throw new BadRequestException(`ES Service error: ${err}`)
    }

    const groupLeaders = authUser.groupLeaders || []
    if (groupLeaders.length) {
      this.mailerService.sendMail({
        subject: `${authUser.name} 申请 kubernetes platform LIVE 容器的登陆权限`,
        to: groupLeaders.join(','),
        text: `Hi, ${authUser.name} 申请 kubernetes [project: ${projectName}] LIVE环境的容器登陆权限,\n申请理由：${
          info.reason || '--'
        }\n请您访问 https://${host}/${APPROVAL_DETAIL_URL}/${id} 进行审批`
      })
    }

    return newAuth
  }

  async requestDetail(requestId: string, rbacUser: IRbacUser) {
    const request = await this.eSService.getById<RequestDetailResponseDto>(ESIndex.AUTH_V2, requestId)

    if (!request) {
      throw new NotFoundException(`Can not find request: ${requestId}`)
    }

    // if (
    //   authUser.name === request.name ||
    //   authUser.name === request.approver ||
    //   authUser.isManager ||
    //   authUser.isAManager ||
    //   authUser.isInfra
    // )
    return request
    // else {
    //   this.logger.error(
    //     `User has no auth to get access detail,
    //     with user name: ${authUser.name},
    //     request applicant: ${request.name},
    //     request approver: ${request.approver},
    //     and user is not a manager or an infra`
    //   )
    //   throw new ForbiddenException('User has no auth to get access detail')
    // }
  }

  async approverPendingList(authUser: IAuthUser, rbacUser: IRbacUser): Promise<RequestListResponseDto> {
    const { group, name } = (authUser as any) || {}
    this.logger.log(`AuthAPIApproverPendingList group ${group}, name: ${name}`)
    return await this.getApproverListByRbac(rbacUser, [AUTH_STATUS.PENDING])
  }

  async approverHistoryList(authUser: IAuthUser, rbacUser: IRbacUser): Promise<RequestListResponseDto> {
    const { group, name } = (authUser as any) || {}
    this.logger.log(`AuthAPIApproverHistoryList group ${group}, name: ${name}`)

    return await this.getApproverListByRbac(rbacUser, [AUTH_STATUS.REJECTED, AUTH_STATUS.APPROVED])
  }

  async requestPendingList(authUser: IAuthUser): Promise<RequestListResponseDto> {
    const { group, name, email } = (authUser as any) || {}
    this.logger.log(`AuthAPIRequestPendingList group ${group}, name: ${name}`)

    const boolQueryParams = {
      must: [
        {
          term: { email }
        },
        {
          term: { status: AUTH_STATUS.PENDING }
        }
      ]
    }
    const { total, documents = [] } = await this.getRequestListByParams(boolQueryParams)

    return {
      totalCount: total,
      items: documents
    }
  }

  async requestList(authUser: IAuthUser, requestType: string): Promise<RequestListResponseDto> {
    const { group, name, email } = (authUser as any) || {}
    this.logger.log(`AuthAPIRequestPendingList group ${group}, name: ${name}`)

    const boolQueryParams = this.buildQueryParamFromRequestTypes(email, requestType)
    const { total, documents = [] } = await this.getRequestListByParams(boolQueryParams)

    return {
      totalCount: total,
      items: documents
    }
  }

  async requestHistoryList(authUser: IAuthUser): Promise<RequestListResponseDto> {
    const { group, name, email } = (authUser as any) || {}
    this.logger.log(`AuthAPIRequestHistoryList group ${group}, name: ${name}`)

    const boolQueryParams = {
      must: [
        {
          term: { email }
        }
      ],
      mustNot: [
        {
          term: { status: AUTH_STATUS.PENDING }
        }
      ]
    }
    const { total, documents = [] } = await this.getRequestListByParams(boolQueryParams)

    return {
      totalCount: total,
      items: documents
    }
  }

  async approveRequest(
    requestId: string,
    authUser: IAuthUser,
    host: string,
    rbacUser: IRbacUser
  ): Promise<RequestDetailResponseDto> {
    const { name: approver } = authUser as any
    this.logger.log(`ApproveRequest requestId: ${requestId}, name: ${approver}`)

    const requestDetail = await this.requestDetail(requestId, rbacUser)
    const { type, email, role, realGroup, group: requestGroup, status: requestStatus } = requestDetail

    await this.checkRequestActionPermission(rbacUser, requestDetail, requestId)
    await this.checkRequestActionStatus(requestStatus)

    if (type === AUTH_TYPE.ADD_ROLE || type === AUTH_TYPE.CHANGE_ROLE) {
      await this.approveRequestToUpdateRbacEs({ email, group: requestGroup, role, type, requestId, authUser })
    }
    if (type === AUTH_TYPE.ADD_ROLE) {
      const { groupInfo } = this.roleService.validateGroupAndRole(realGroup, role)
      await this.approveRequestToUpdateUserEs({ email, role, departmentId: groupInfo.id, requestId, authUser })
    }

    const newRequestDetail = await this.approveRequestToUpdateAuthEs({
      requestId,
      requestDetail,
      newStatus: AUTH_STATUS.APPROVED,
      approver
    })

    this.approveRequestToSendEmail({ requestGroup, role, status: AUTH_STATUS.APPROVED, email, host, requestId, type })

    return newRequestDetail
  }

  async rejectRequest(
    requestId: string,
    authUser: IAuthUser,
    host: string,
    rbacUser: IRbacUser
  ): Promise<RequestDetailResponseDto> {
    const { name: approver } = authUser as any
    this.logger.log(`RejectRequest requestId: ${requestId}, name: ${approver}`)

    const requestDetail = await this.requestDetail(requestId, rbacUser)
    const { group: requestGroup, status: requestStatus, role, email, type } = requestDetail

    await this.checkRequestActionPermission(rbacUser, requestDetail, requestId)
    await this.checkRequestActionStatus(requestStatus)

    const newRequestDetail = await this.approveRequestToUpdateAuthEs({
      requestId,
      requestDetail,
      newStatus: AUTH_STATUS.REJECTED,
      approver
    })

    this.approveRequestToSendEmail({ requestGroup, role, status: AUTH_STATUS.REJECTED, email, host, requestId, type })

    return newRequestDetail
  }

  // helpers
  async getApproverListByRbac(rbacUser: IRbacUser, status: string[]) {
    // const { groups = {} } = rbacUser || {}
    const groups = {}

    const results = await Promise.all(
      Object.values(groups).map(async ({ group, rules }) => {
        const isSRE =
          rules[GROUP_RESOURCES.ADD_ROLE] &&
          rules[GROUP_RESOURCES.ADD_ROLE].availableVerbs[ACCESS_CONTROL_VERBS.VIEW_APPROVE]
        const isManager =
          rules[GROUP_RESOURCES.TERMINAL_ACCESS] &&
          rules[GROUP_RESOURCES.TERMINAL_ACCESS].availableVerbs[ACCESS_CONTROL_VERBS.VIEW_APPROVE]

        if (!isSRE && !isManager) {
          return { total: 0, documents: [] }
        }

        // SRE + Manager，查看所有type的request
        const boolQueryParams: IEsBooleanQuery = {
          must: [
            {
              term: { group }
            },
            {
              terms: { status }
            }
          ]
        }
        // SRE查看除terminal以外的request
        if (!isManager) {
          boolQueryParams.must.push({
            terms: { type: [AUTH_TYPE.ADD_ROLE, AUTH_TYPE.CHANGE_ROLE, AUTH_TYPE.ADD_ROLE] }
          })
        }
        // Manager查看terminal request
        if (!isSRE) {
          boolQueryParams.mustNot = [
            {
              terms: { type: [AUTH_TYPE.ADD_ROLE, AUTH_TYPE.CHANGE_ROLE, AUTH_TYPE.ADD_ROLE] }
            }
          ]
        }
        return await this.getRequestListByParams(boolQueryParams)
      })
    )

    let totalCount = 0
    let items = []
    results.forEach(({ total, documents = [] }) => {
      totalCount += total
      items = [...items, ...documents]
    })
    return {
      totalCount,
      items
    }
  }

  async getRequestListByParams(boolQueryParams = {}) {
    try {
      return await this.eSService.booleanQueryAll<RequestListItem>(
        ESIndex.AUTH_V2,
        boolQueryParams,
        ES_MAX_SEARCH_COUNT,
        undefined,
        undefined,
        (hits) =>
          hits.map(({ _source: request, _id: id }) => ({ ...request, type: request.type || AUTH_TYPE.TERMINAL, id }))
      )
    } catch (err) {
      throw new BadRequestException(`ES Service error: ${err}`)
    }
  }

  async checkRequestActionPermission(rbacUser: IRbacUser, requestDetail: RequestDetailResponseDto, requestId: string) {
    const { group, type } = requestDetail
    const { groups } = (rbacUser || {}) as any
    const groupRole = groups[group]

    if (!groupRole) {
      this.logger.log(
        `Approve|Reject request error, request group: ${group}, request type: ${type}, requestId: ${requestId} rbacGroupRole: ${groupRole}`
      )
      throw new ForbiddenException(ERROR_MESSAGE.ACCESS_FORBIDDEN)
    }

    const { rules = {} } = groupRole
    let resourceAccess = { availableVerbs: {} }

    switch (type) {
      case AUTH_TYPE.CHANGE_ROLE:
        resourceAccess = rules[GROUP_RESOURCES.CHANGE_ROLE]
        break
      case AUTH_TYPE.ADD_ROLE:
        resourceAccess = rules[GROUP_RESOURCES.ADD_ROLE]
        break
      default:
        resourceAccess = rules[GROUP_RESOURCES.TERMINAL_ACCESS]
    }

    if (!(resourceAccess.availableVerbs && resourceAccess.availableVerbs[ACCESS_CONTROL_VERBS.VIEW_APPROVE])) {
      this.logger.log(
        `Approve|Reject request error, request group: ${group}, request type: ${type}, requestId: ${requestId} rbacGroupRules: ${rules}`
      )
      throw new ForbiddenException(ERROR_MESSAGE.ACCESS_FORBIDDEN)
    }
  }

  private buildQueryParamFromRequestTypes(email: string, requestType: string) {
    const result: IEsBooleanQuery = {
      must: [
        {
          term: { email }
        }
      ]
    }

    const pendingStatus = {
      term: { status: AUTH_STATUS.PENDING }
    }

    switch (requestType) {
      case requestTypes.PENDING:
        result.must.push(pendingStatus)
        break
      case requestTypes.FINISHED:
        result.mustNot = []
        result.mustNot.push(pendingStatus)
        break
      default:
        break
    }

    return result
  }

  private approveRequestToSendEmail({ requestGroup, role, status, email, host, requestId, type }) {
    const subject = `申请 kubernetes platform 权限审批结果[${status}]`
    const text = `Hi, 您申请了 kubernetes platform ${
      AUTH_TYPE_WORDS[type || AUTH_TYPE.TERMINAL]
    }（Group:${requestGroup}，Role:${role})，审批结果为[${status}],请访问 https://${host}/${REQUEST_DETAIL_URL}/${requestId} 查看详情`

    this.mailerService.sendMail({ subject, to: email, text })
  }

  async approveRequestToUpdateAuthEs({ requestId, requestDetail, newStatus, approver }) {
    requestDetail.status = newStatus
    requestDetail.updatetime = moment().toDate()
    requestDetail.approver = approver

    try {
      await this.eSService.update(ESIndex.AUTH_V2, requestId, requestDetail)
    } catch (err) {
      throw new BadRequestException(`ES Service error: ${err}`)
    }

    return requestDetail
  }

  async checkRequestActionStatus(requestStatus) {
    if (requestStatus === AUTH_STATUS.APPROVED || requestStatus === AUTH_STATUS.REJECTED) {
      throw new HttpException(`This Access has been handled as ${requestStatus}`, HttpStatus.CONFLICT)
    }
  }

  async approveRequestToUpdateRbacEs({ email, group, role, type, requestId, authUser }) {
    try {
      const rbacUserWrap = await this.eSService.termQueryFirst<any>(ESIndex.RBAC, 'email', email, (data) => data)

      const newGroup = `${group}${role ? `:${role}` : ''}`

      if (!rbacUserWrap) {
        const rbacUser = {
          email,
          groups: [newGroup]
        }

        if (type === AUTH_TYPE.ADD_ROLE) {
          const requestUser = await this.eSService.termQueryFirst(ESIndex.USER, 'email', email)

          if (requestUser) {
            const realRole = requestUser.role || requestUser.position
            const realGroup = this.getGroupNameFromDepartmentId(requestUser.main_department)
            const requestUserGroup = `${realGroup}${realRole ? `:${realRole}` : ''}`
            rbacUser.groups = [requestUserGroup, newGroup]
          }
        }

        await this.eSService.index(ESIndex.RBAC, rbacUser)
      } else {
        const { _id: id, _source: rbacUser } = rbacUserWrap
        rbacUser.groups = type === AUTH_TYPE.CHANGE_ROLE ? [newGroup] : [...rbacUser.groups, newGroup]
        await this.eSService.update(ESIndex.RBAC, id, rbacUser)
      }
    } catch (err) {
      this.logger.error(
        `ES Service error: ${err} in approveRequest, requestId: ${requestId}, index: ${ESIndex.RBAC}, email: ${email}, operator name: ${authUser.name}`
      )
      throw new BadRequestException(`ES Service error: ${err}`)
    }
  }

  private getGroupNameFromDepartmentId(departmentId: number) {
    let group = ''
    Object.entries(GroupInfo).forEach(([name, info]) => {
      if (info.id === departmentId) {
        group = name
      }
    })
    return group
  }

  async approveRequestToUpdateUserEs({ email, role, departmentId, requestId, authUser }) {
    try {
      const { _id: id, _source: user } = await this.eSService.termQueryFirst(
        ESIndex.USER,
        'email',
        email,
        (data) => data
      )
      user.role = role
      user.position = role
      user.main_department = departmentId
      await this.eSService.update(ESIndex.USER, id, user)
    } catch (err) {
      this.logger.error(
        `ES Service error: ${err} in approveRequest, requestId: ${requestId}, index: ${ESIndex.USER}, operator name: ${authUser.name}`
      )
      throw new BadRequestException(`ES Service error: ${err}`)
    }
  }

  async getLatestAccessApplyRecord(
    tenantId: number,
    projectName: string,
    userId: number,
    userEmail: string
  ): Promise<IESTicket> {
    const booleanQuery = {
      must: [
        {
          term: { tenant: tenantId }
        },
        {
          term: { project: projectName }
        },
        {
          term: { applicant: userId }
        }
      ]
    }
    const sort = ['createdAt:desc']
    let lastedRecord: IESTicket

    try {
      lastedRecord = await this.eSService.booleanQueryFirst<IESTicket>(ESIndex.TICKET, booleanQuery, undefined, sort)
    } catch (err) {
      throw new InternalServerErrorException(`Search ES index ${ESIndex.TICKET} error: ${err}!`)
    }

    if (!lastedRecord) {
      throw new NotFoundException(`${userEmail}'s terminal access apply for project ${projectName} record not found!`)
    }

    // // PENDING terminal access apply record has no approver

    return lastedRecord
  }
}
