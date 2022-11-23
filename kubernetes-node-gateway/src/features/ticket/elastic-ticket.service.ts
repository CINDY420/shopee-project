import { ERROR } from '@/common/constants/error'
import { ES_DEFAULT_OFFSET, ES_INDEX, ES_MAX_COUNT, ES_ORDER_ASCEND, ES_ORDER_DESCEND } from '@/common/constants/es'
import { PLATFORM_TENANT_ID, RESOURCE_ACTION, RESOURCE_TYPE } from '@/common/constants/rbac'
import {
  ES_TICKET_EXECUTE_TASK_ACTION_MAP,
  ES_TICKET_STAGE_MAP,
  ES_TICKET_STATUS_CANCELED,
  ES_TICKET_STATUS_MAP,
  TICKET_EXECUTION_EMAIL_CONTENT,
  TICKET_EXECUTION_EMAIL_SUBJECT,
  TICKET_STARTER_DETAIL_URL,
} from '@/common/constants/ticket'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
import { Logger } from '@/common/utils/logger'
import { throwError } from '@/common/utils/throw-error'
import { tryCatch } from '@/common/utils/try-catch'
import { ElasticsearchTicket } from '@/features/ticket/dto/elasticsearch-ticket-service/elasticsearch-ticket.model'
import { GetTicketsResponse, ListTicketsQuery } from '@/features/ticket/dto/ticket-service/list-tickets.dto'
import {
  ElasticsearchTicketExtraInfo,
  ELASTIC_TICKET_STAGE,
  ShopeeTicketExtraInfo,
  Ticket,
  TICKET_PERSPECTIVE,
  TICKET_STATUS,
  TICKET_TYPE,
} from '@/features/ticket/dto/ticket-service/ticket.model'
import { AuthInfoProvider } from '@/shared/auth/auth-info.provider'
import { AuthService } from '@/shared/auth/auth.service'
import { SearchHit, SearchResponse, SearchTotalHits } from '@elastic/elasticsearch/api/types'
import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import elasticBuilder from 'elastic-builder'
import BPromise from 'bluebird'
import { hasSource } from '@/shared/elasticsearch/elasticsearch.interface'
import { EXECUTE_TASK_ACTION } from '@/features/ticket/dto/shopee-ticket-center/execute-task.dto'
import { MailerService } from '@/shared/mailer/mailer.service'
import { format } from 'util'
import { DEFAULT_CONCURRENCY } from '@/common/constants/concurrency'

@Injectable()
export class ElasticTicketService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly logger: Logger,
    private readonly authInfoProvider: AuthInfoProvider,
  ) {
    this.logger.setContext(ElasticTicketService.name)
  }

  public async getTicketDetailById(ticketId: string): Promise<Ticket> {
    const elasticTicket = await this.getElasticTicketById(ticketId)
    return this.getTicketDetail({ ticketId, ticket: elasticTicket })
  }

  public async listTickets(query: ListTicketsQuery): Promise<GetTicketsResponse> {
    const { perspective } = query
    if (perspective === TICKET_PERSPECTIVE.APPROVER) {
      return this.listApproverTickets(query)
    }

    if (perspective === TICKET_PERSPECTIVE.STARTER) {
      return this.listStarterTickets(query)
    }

    return {
      items: [],
      total: 0,
    }
  }

  public async processTicket(ticketId: string, action: EXECUTE_TASK_ACTION, host: string): Promise<void> {
    const authUser = this.authInfoProvider.getAuthUser()
    const token = this.authInfoProvider.getAuthToken()
    const elasticTicket = await this.getElasticTicketById(ticketId)

    const { status } = elasticTicket

    if (status !== ELASTIC_TICKET_STAGE.PENDING) {
      throwError(ERROR.SYSTEM_ERROR.TICKET_SERVICE.PRECONDITION_FAILED, ticketId)
    }

    const { metaInfo, extraInfo } = await this.getTicketDetailById(ticketId)
    const { applicantEmail, ticketType, applicantId } = metaInfo

    const isElasticsearchTicketExtraInfo = (
      extraInfo: ElasticsearchTicketExtraInfo | ShopeeTicketExtraInfo,
    ): extraInfo is ElasticsearchTicketExtraInfo => extraInfo.ticketVersion === ('ELASTICSEARCH' as const)

    if (!isElasticsearchTicketExtraInfo(extraInfo)) {
      throwError(ERROR.SYSTEM_ERROR.TICKET_SERVICE.BAD_CONDITION)
    }
    const { tenantName, project, tenantId, permissionGroupId } = extraInfo

    const handleAddRoleOrChangeRole = async () => {
      const oldRoleInfo = authUser?.roles.find(({ tenantId: oldTenantId }) => oldTenantId === permissionGroupId)
      if (oldRoleInfo) {
        const [_, error] = await tryCatch(
          this.authService.deleteTenantRole(
            Number(oldRoleInfo.tenantId),
            Number(applicantId),
            Number(oldRoleInfo.roleId),
            token,
          ),
        )

        if (error) {
          this.logger.error(`Delete Tenant Role failed: ${error.message}`)
        }
      }
      await this.authService.addTenantRole(Number(tenantId), Number(applicantId), { roleId: permissionGroupId }, token)
    }

    if (
      action === EXECUTE_TASK_ACTION.APPROVAL &&
      (ticketType === TICKET_TYPE.ADD_ROLE || ticketType === TICKET_TYPE.CHANGE_ROLE)
    ) {
      await handleAddRoleOrChangeRole()
    }

    const updateTicketBody = {
      status: ES_TICKET_EXECUTE_TASK_ACTION_MAP[action],
      approver: authUser?.ID,
      updatedAt: new Date(),
    }

    const [result, error] = await tryCatch(
      this.elasticsearchService.update({
        index: ES_INDEX.TICKET,
        id: ticketId,
        body: {
          doc: updateTicketBody,
        },
      }),
    )

    if (error || !result) {
      throwError(ERROR.SYSTEM_ERROR.ES_SERVICE.REQUEST_ERROR, `update ticket ${ticketId} failed: ${error?.stack}`)
    }

    this.mailerService
      .sendMail({
        subject: format(TICKET_EXECUTION_EMAIL_SUBJECT, action.toUpperCase()),
        to: applicantEmail,
        text: format(
          TICKET_EXECUTION_EMAIL_CONTENT[ticketType],
          tenantName,
          project,
          action.toUpperCase(),
          `${host}/${TICKET_STARTER_DETAIL_URL}/${ticketId}`,
        ),
      })
      .then(() => {
        this.logger.log('send email success')
      })
  }

  public async cancelTicket(ticketId: string): Promise<void> {
    const authUser = this.authInfoProvider.getAuthUser()
    const elasticTicket = await this.getElasticTicketById(ticketId)
    const { applicant, status } = elasticTicket

    if (applicant !== authUser?.ID) {
      throwError(ERROR.SYSTEM_ERROR.TICKET_SERVICE.FORBIDDEN, 'you are not the ticket creator')
    }

    if (status !== ELASTIC_TICKET_STAGE.PENDING) {
      throwError(ERROR.SYSTEM_ERROR.TICKET_SERVICE.FORBIDDEN, 'ticket is not pending')
    }

    const updateBody = {
      status: ES_TICKET_STATUS_CANCELED,
      updateTime: new Date(),
    }
    const [result, error] = await tryCatch(
      this.elasticsearchService.update({
        index: ES_INDEX.TICKET,
        id: ticketId,
        body: {
          doc: updateBody,
        },
      }),
    )

    if (error || !result) {
      throwError(ERROR.SYSTEM_ERROR.ES_SERVICE.REQUEST_ERROR, error?.message ?? '')
    }
  }

  private async getElasticTicketById(ticketId: string) {
    const elasticTicket = await this.elasticsearchService
      .get<SearchHit<ElasticsearchTicket>>({
        index: ES_INDEX.TICKET,
        id: ticketId,
      })
      .then((result) => result.body._source)

    if (!elasticTicket) {
      const message = `get ticket ${ticketId} from es failed`
      this.logger.error(message)
      throwError(ERROR.SYSTEM_ERROR.ES_SERVICE.REQUEST_ERROR, message)
    }

    return elasticTicket
  }

  private async getTicketDetail(params: { ticketId: string; ticket: ElasticsearchTicket }) {
    const { ticketId, ticket } = params
    const token = this.authInfoProvider.getAuthToken()
    const { type, applicant, approver, createdAt, updatedAt, tenant, permissionGroup, purpose, status, project } =
      ticket
    const stage = ES_TICKET_STAGE_MAP[status]

    const getTenantName = async () => {
      const tenantId = Number(tenant)
      const isTenantRelative = tenantId !== PLATFORM_TENANT_ID
      if (isTenantRelative) {
        const tenantInfo = await this.authService.getTenantById(tenantId, token)
        return tenantInfo.name
      }
      return ''
    }

    const getApprover = async () => {
      if (approver) {
        const result = await this.authService.batchGetUsers([approver], token)
        const userList = result.users
        const approverInfo = userList[0]
        return approverInfo.email
      }

      return ''
    }

    const listAssignee = async () => {
      if (status === ELASTIC_TICKET_STAGE.PENDING) {
        const response =
          type === TICKET_TYPE.TERMINAL
            ? await this.authService.listTenantTerminalApprovers(tenant, token)
            : await this.authService.listTenantUserApprovers(tenant, token)
        const { users, totalSize } = response
        if (totalSize === 0) {
          throwError(ERROR.SYSTEM_ERROR.ES_SERVICE.REQUEST_ERROR, 'no approvers for this pending ticket')
        }
        return users.map((user) => user.email)
      }

      return []
    }

    const getApplicantInfo = async () => {
      const result = await this.authService.batchGetUsers([applicant], token)
      const listApplicants = result.users
      return listApplicants[0]
    }

    const getPermissionGroupName = async () => {
      if (permissionGroup) {
        const permissionsGroupInfo = await this.authService.getRoleById(Number(permissionGroup), token)

        return permissionsGroupInfo.name
      }

      return ''
    }

    const assigneeList = await listAssignee()
    const applicantInfo = await getApplicantInfo()
    const approverName = await getApprover()
    const approverList = approverName ? [approverName] : []

    return {
      metaInfo: {
        ticketId,
        displayId: ticket.displayId || ticketId,
        ticketType: type,
        status: status === ELASTIC_TICKET_STAGE.PENDING ? TICKET_STATUS.OPEN : TICKET_STATUS.CLOSED,
        stage,
        purpose: purpose ?? '',
        approverList,
        assigneeList,
        updateTime: updatedAt,
        createTime: createdAt,
        applicantEmail: applicantInfo.email,
        applicantId: applicantInfo.userId,
        applicantName: applicantInfo.name,
      },
      extraInfo: {
        tenantId: Number(tenant),
        tenantName: `${await getTenantName()}`,
        project: project ?? '',
        permissionGroupId: Number(permissionGroup) ?? undefined,
        permissionGroupName: `${await getPermissionGroupName()}`,
        ticketVersion: 'ELASTICSEARCH' as const,
      },
    }
  }

  private async listApproverTickets(query: Omit<ListTicketsQuery, 'perspective'>) {
    const { filterBy, orderBy, ticketStatus } = query
    const authToken = this.authInfoProvider.getAuthToken()
    const authUser = this.authInfoProvider.getAuthUser()
    const roles = authUser?.roles

    const status = ElasticTicketService.getEsTicketStatus(ticketStatus)
    if (!roles) {
      throwError(ERROR.SYSTEM_ERROR.AUTH.REQUEST_ERROR, `can not get user's roles ${authUser}`)
    }
    const tenantPermissions = await this.authService.getTenantPermissions(authUser?.roles, authToken)
    const validTenantPermissions = Object.entries(tenantPermissions).filter(([tenantId, tenantResourcePermissions]) => {
      // filter out global user apply if user have no permission to approve access ticket
      if (Number(tenantId) === PLATFORM_TENANT_ID) {
        const accessTicketPermissions = tenantResourcePermissions[RESOURCE_TYPE.ACCESS_TICKET] || []
        return accessTicketPermissions.includes(RESOURCE_ACTION.APPROVE)
      }
      return true
    })

    const booleanQuery = new elasticBuilder.BoolQuery()
    const isClose = ticketStatus === TICKET_STATUS.CLOSED

    validTenantPermissions.forEach(([tenantId, tenantResourcePermissions]) => {
      const currentTenantUserPermissions = tenantResourcePermissions[RESOURCE_TYPE.TENANT_USER] || []
      const currentTerminalPermissions = tenantResourcePermissions[RESOURCE_TYPE.POD_TERMINAL] || []

      const roleRelativeBooleanQuery = elasticBuilder.boolQuery()
      const terminalRelativeBooleanQuery = elasticBuilder.boolQuery()

      const hasPermissionTenantUserAdd = currentTenantUserPermissions.includes(RESOURCE_ACTION.ADD)
      if (hasPermissionTenantUserAdd) {
        roleRelativeBooleanQuery
          .must(elasticBuilder.termsQuery('type', [TICKET_TYPE.ADD_ROLE, TICKET_TYPE.CHANGE_ROLE]))
          .must(elasticBuilder.termQuery('tenant', tenantId))
          .must(elasticBuilder.termsQuery('status', status))
          .filter(this.formatFilterByToEsBuilder(filterBy))
          .filter(isClose ? elasticBuilder.termsQuery('approver', authUser.ID) : [])

        booleanQuery.should(roleRelativeBooleanQuery)
      }

      const hasPermissionTerminalApproveList = currentTerminalPermissions.includes(RESOURCE_ACTION.APPROVE_LIVE)
      if (hasPermissionTerminalApproveList) {
        terminalRelativeBooleanQuery
          .must(elasticBuilder.termsQuery('type', [TICKET_TYPE.TERMINAL]))
          .must(elasticBuilder.termQuery('tenant', tenantId))
          .must(elasticBuilder.termsQuery('status', status))
          .filter(this.formatFilterByToEsBuilder(filterBy))
          .filter(isClose ? elasticBuilder.termsQuery('approver', authUser.ID) : [])

        booleanQuery.should(terminalRelativeBooleanQuery)
      }
    })

    const queryObject = booleanQuery.toJSON() as { bool: { should: unknown[] } } // todo: add type shim @zebin.lu
    if (!queryObject?.bool?.should) {
      return {
        items: [],
        total: 0,
      }
    }

    const queryBody = elasticBuilder
      .requestBodySearch()
      .query(booleanQuery)
      .sort(this.formatOrderByToEsBuilder(orderBy))
      .from(ES_DEFAULT_OFFSET)
      .size(ES_MAX_COUNT)

    const [result, error] = await tryCatch(
      this.elasticsearchService.search<SearchResponse<ElasticsearchTicket>>({
        index: ES_INDEX.TICKET,
        body: queryBody.toJSON(),
      }),
    )

    if (error || !result) {
      throwError(
        ERROR.SYSTEM_ERROR.ES_SERVICE.REQUEST_ERROR,
        error?.message ?? `with query body ${JSON.stringify(queryBody.toJSON())}`,
      )
    }

    const elasticTicketInfoList = result.body.hits.hits.filter(hasSource).map((hit) => ({
      ticketId: hit._id,
      ticket: hit._source,
    }))

    const total = ElasticTicketService.getEsTotal(result.body.hits.total)
    const tickets = await BPromise.resolve(elasticTicketInfoList).map(
      ({ ticketId, ticket }) => this.getTicketDetail({ ticketId, ticket }),
      { concurrency: DEFAULT_CONCURRENCY },
    )

    return { items: tickets, total }
  }

  private async listStarterTickets(query: Omit<ListTicketsQuery, 'perspective'>) {
    const { filterBy, orderBy, ticketStatus } = query
    const authUser = this.authInfoProvider.getAuthUser()
    if (!authUser?.ID) {
      throwError(ERROR.SYSTEM_ERROR.AUTH.REQUEST_ERROR, `auth user id not exist ${JSON.stringify(authUser)}`)
    }

    const queryBody = elasticBuilder
      .requestBodySearch()
      .sort(this.formatOrderByToEsBuilder(orderBy))
      .from(ES_DEFAULT_OFFSET)
      .size(ES_MAX_COUNT)

    const status = ElasticTicketService.getEsTicketStatus(ticketStatus)
    const [result, error] = await tryCatch(
      this.elasticsearchService.search<SearchResponse<ElasticsearchTicket>>({
        index: ES_INDEX.TICKET,
        body: queryBody
          .query(
            elasticBuilder
              .boolQuery()
              .must(elasticBuilder.termsQuery('status', status))
              .must(elasticBuilder.termQuery('applicant', authUser.ID))
              .filter(this.formatFilterByToEsBuilder(filterBy)),
          )
          .toJSON(),
      }),
    )

    if (error || !result) {
      throwError(ERROR.SYSTEM_ERROR.ES_SERVICE.REQUEST_ERROR, error?.message ?? '')
    }

    const total = ElasticTicketService.getEsTotal(result.body.hits.total)
    const elasticTicketInfoList = result.body.hits.hits.filter(hasSource).map((hit) => ({
      ticketId: hit._id,
      ticket: hit._source,
    }))

    const tickets = await BPromise.resolve(elasticTicketInfoList).map(
      ({ ticketId, ticket }) => this.getTicketDetail({ ticketId, ticket }),
      { concurrency: DEFAULT_CONCURRENCY },
    )

    return {
      items: tickets,
      total,
    }
  }

  private static getEsTotal(total: number | SearchTotalHits) {
    return typeof total === 'number' ? Number(total) : Number(total.value)
  }

  private static getEsTicketStatus(ticketStatus?: TICKET_STATUS | undefined) {
    if (!ticketStatus) {
      return Object.values(ELASTIC_TICKET_STAGE)
    }

    return ES_TICKET_STATUS_MAP[ticketStatus]
  }

  private formatFilterByToEsBuilder(filterBy = '') {
    const results = ListQuery.parseFilterBy(filterBy)

    if (!results) {
      return []
    }

    const propertiesMap: Record<string, string> = {
      'metaInfo.ticketType': 'type',
    }

    const filters = results[0]
    return filters.map((filter) => {
      const { keyPath, value } = filter
      return elasticBuilder.termQuery(propertiesMap[keyPath], value)
    })
  }

  private formatOrderByToEsBuilder(orderBy = 'metaInfo.createTime desc') {
    const [key, order = ES_ORDER_ASCEND] = orderBy?.split(' ')
    const propertiesMap: Record<string, string> = {
      'metaInfo.createTime': 'createdAt',
    }

    const field = propertiesMap[key]

    if ((order !== ES_ORDER_ASCEND && order !== ES_ORDER_DESCEND) || !field) {
      this.logger.error(`Invalid query params orderBy: ${orderBy}`)
      return elasticBuilder.sort()
    }

    const sort = order ? elasticBuilder.sort(field, order) : elasticBuilder.sort(field)

    return sort
  }
}
