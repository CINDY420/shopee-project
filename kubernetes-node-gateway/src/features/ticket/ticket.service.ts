import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import moment from 'moment'

import { throwError } from '@/common/utils/throw-error'
import { Logger } from '@/common/utils/logger'
import { ERROR } from '@/common/constants/error'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
import { parseClusterId } from '@/common/utils/deployments/parseClusterId'
import { AuthInfoProvider } from '@/shared/auth/auth-info.provider'
import { AuthService } from '@/shared/auth/auth.service'
import { OpenApiService } from '@/shared/open-api/open-api.service'

import { ShopeeTicketCenterService } from '@/features/ticket/shopee-ticket-center.service'
import { CreateScaleDeploymentTicketBody } from '@/features/ticket/dto/ticket-service/create-ticket.dto'
import { IUpdateShopeeTicketParams } from '@/features/ticket/dto/shopee-ticket-center/update-ticket.dto'
import {
  isKnownTicketType,
  ShopeeScaleDeploymentTicketExtraInfo,
  ShopeeTicketExtraInfo,
  Ticket,
  TICKET_PERSPECTIVE,
  TICKET_STAGE,
  TICKET_STATUS,
  TICKET_TYPE,
  TICKET_VERSION,
  TicketMetaInfo,
} from '@/features/ticket/dto/ticket-service/ticket.model'
import {
  ScaleDeploymentTicketForm,
  ShopeeTicket,
  TicketEvent,
} from '@/features/ticket/dto/shopee-ticket-center/shopee-ticket.model'
import {
  GetTicketListCondition,
  isOrderSupportedByShopeeTicketCenter,
  SHOPPE_TICKET_LIST_ORDER,
} from '@/features/ticket/dto/shopee-ticket-center/get-ticket-list.dto'
import { ListTicketsQuery } from '@/features/ticket/dto/ticket-service/list-tickets.dto'
import { ElasticTicketService } from '@/features/ticket/elastic-ticket.service'
import { UpdateTasksBody, UpdateTasksParam } from '@/features/ticket/dto/ticket-service/update-tasks.dto'
import { QUERY_ALL } from '@/common/constants/query'
import { tryCatch } from '@/common/utils/try-catch'

@Injectable()
export class TicketService {
  constructor(
    private readonly shopeeTicketCenterService: ShopeeTicketCenterService,
    private readonly configService: ConfigService,
    private readonly elasticTicketService: ElasticTicketService,
    private readonly logger: Logger,
    private readonly authInfoProvider: AuthInfoProvider,
    private readonly authService: AuthService,
    private readonly openApiService: OpenApiService,
  ) {
    this.logger.setContext(TicketService.name)
  }

  private async getTicketAssignees(clusterName: string, tenantId: number) {
    const SPECIAL_CLUSTERS = this.configService.get<string[]>('global.specialDeploymentForTest')
    const QUERY_ALL = { offset: '0', limit: '9999' }
    const token = this.authInfoProvider.getAuthToken()
    const TENANT_ADMIN_ROLE_NAME = '2001'
    const tenantUserList = SPECIAL_CLUSTERS?.includes(clusterName)
      ? await this.authService.getPlatformAdmins(token) // Platform admin
      : await this.authService.getTenantUserList(
          tenantId,
          {
            ...QUERY_ALL,
            // Tenant admin
            filterBy: `roleName==${TENANT_ADMIN_ROLE_NAME}`,
          },
          token,
        )
    return tenantUserList.tenantUsers.map((tenantUsers) => tenantUsers.user.email)
  }

  public async createScaleDeploymentTicket(ticket: CreateScaleDeploymentTicketBody, host: string) {
    const { scaleDeploymentTicketForm, scaleDeploymentTicketExtraInfo } = ticket

    const SCALE_CONFIG_PREFIX = `shopeeTicketCenter.processInfo.${TICKET_TYPE.DEPLOYMENT_SCALE}`
    const processDefinitionIdOrKey = this.configService.get<string>(`${SCALE_CONFIG_PREFIX}.processId`)
    const assigneeActivityKey = this.configService.get<string>(`${SCALE_CONFIG_PREFIX}.assigneeActivityKey`)
    if (!processDefinitionIdOrKey || !assigneeActivityKey) {
      throwError(ERROR.SYSTEM_ERROR.TICKET_SERVICE.CONFIG_LACK)
    }

    const { clusterName } = parseClusterId(ticket.scaleDeploymentTicketForm.clusterId)
    const title = ticket.title
    const assigneeList = await this.getTicketAssignees(
      clusterName,
      Number(ticket.scaleDeploymentTicketExtraInfo.tenantId),
    )
    if (!assigneeList.length) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.SHOPEE_TICKET_CENTER_ERROR.ASSIGNEES_LACK)
    }
    const customAssignee = {
      [assigneeActivityKey]: assigneeList,
    }
    const callbackUrl =
      `${this.configService.get<string>('openApiExternal.protocol')}://${this.configService.get<string>(
        'openApiExternal.host',
      )}` +
      `/openapi/v1/tenants/${scaleDeploymentTicketExtraInfo.tenantId}` +
      `/projects/${scaleDeploymentTicketExtraInfo.projectName}` +
      `/applications/${scaleDeploymentTicketExtraInfo.appName}/deployments:scale`

    const deploymentInfo = {
      deployName: scaleDeploymentTicketForm.deployment,
      clusterId: scaleDeploymentTicketForm.clusterId,
      appInstanceName: scaleDeploymentTicketExtraInfo.appInstanceName,
      releaseCount: scaleDeploymentTicketForm.targetReleasePodCount,
      canaryCount: scaleDeploymentTicketForm.targetCanaryPodCount,
      canaryValid: scaleDeploymentTicketExtraInfo.canaryValid,
    }

    const applicantId = this.authInfoProvider.getAuthUser()?.ID ?? -1
    const applicantName = this.authInfoProvider.getAuthUser()?.userName ?? ''

    const result = await this.shopeeTicketCenterService.createTicket<ScaleDeploymentTicketForm>({
      title,
      processDefinitionIdOrKey,
      customAssignee,
      formVariables: {
        ...ticket.scaleDeploymentTicketForm,
        auditResponse: '',
      },
      processVariables: {
        ticketType: TICKET_TYPE.DEPLOYMENT_SCALE,
        /**
         * STC工单并无assignees字段（因为STC工单的assignees分是task的），为了兼容统一工单格式，这里需要存一下assignees
         */
        assigneeList,
        /**
         * approveCallback开头的用于STC平台上的approve的回调脚本，每一个工单的processVariables对象不同，脚本会读取这些变量，然后来发请求
         */
        approveCallbackUrl: callbackUrl,
        approveCallbackBodyJSON: JSON.stringify({ deploys: [deploymentInfo] }),
        approveCallbackToken: this.configService.get<string>('shopeeTicketCenter.botToken'),
        ...ticket.scaleDeploymentTicketExtraInfo,
        // 存一下用户是哪个环境的，发邮件用
        host,
        // 存一下K8s平台的id, name，回显用
        applicantId,
        applicantName,
      },
    })
    delete result.variables.approveCallbackToken

    const metaInfo: TicketMetaInfo = {
      applicantId,
      applicantName,
      createTime: result.startAt,
      updateTime: '',
      approverList: [],
      assigneeList,
      purpose: result.variables.purpose,
      status: result.globalStatus,
      ticketId: result.id,
      displayId: result.id,
      ticketType: TICKET_TYPE.DEPLOYMENT_SCALE,
      stage: TICKET_STAGE.PENDING,
      applicantEmail: result.starter.email,
    }
    const extraInfo: ShopeeScaleDeploymentTicketExtraInfo = {
      ...ticket.scaleDeploymentTicketExtraInfo,
      variables: {
        ...ticket.scaleDeploymentTicketForm,
        ...ticket.scaleDeploymentTicketExtraInfo,
        ...result.variables,
      },
      ticketVersion: 'SHOPEE_TICKET_CENTER',
      title: result.title,
      hoursFromCreation: result.hoursFromCreation,
    }

    return {
      metaInfo,
      extraInfo,
    }
  }

  /**
   * 兼容方法：将stc工单转成标准工单
   * todo jiyao.hong 向stc提要求，使得能一次性拉全信息，不需要额外的event log接口
   * @private
   */
  private async convertShopeeTicketToTicket(ticket: ShopeeTicket) {
    const email = this.authInfoProvider.getAuthUser()?.Email
    const { shopeeTicketCenterService } = this

    // 审批信息在这个接口里
    const ticketEvents = await this.shopeeTicketCenterService.getTicketEvents(ticket.id)
    // 数据脱敏
    delete ticket.variables.approveCallbackToken

    // 点通过的人的列表需要将所有task遍历一遍
    const approverList = ticketEvents.items
      .map((event) => {
        if (TicketEvent.isTaskApprovedEvent(event)) {
          return event.data.approver
        }
        return ''
      })
      .filter((name) => name.length)

    const rejecterList = ticketEvents.items
      .map((event) => {
        if (TicketEvent.isTicketTaskRejectedEvent(event)) {
          return event.data.operator
        }
        return ''
      })
      .filter((name) => name.length)

    const approvedTime = ticketEvents.items.find((event) => TicketEvent.isTicketApprovedEvent(event))?.createdAt ?? ''
    const cancelledTime = ticketEvents.items.find((event) => TicketEvent.isTicketCanceledEvent(event))?.createdAt ?? ''
    const rejectedTime = ticketEvents.items.find((event) => TicketEvent.isTicketRejectedEvent(event))?.createdAt ?? ''

    const assigneeList =
      Array.isArray(ticket.variables.assigneeList) && typeof ticket.variables.assigneeList[0] === 'string'
        ? ticket.variables.assigneeList
        : []
    const purpose = typeof ticket.variables.purpose === 'string' ? ticket.variables.purpose : ''

    const ticketType = ticket.variables.ticketType
    if (!isKnownTicketType(ticketType)) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.SHOPEE_TICKET_CENTER_ERROR.TICKET_OPERATION_FAILED)
    }

    function getStage() {
      if (ticket.globalStatus === TICKET_STATUS.OPEN) {
        return TICKET_STAGE.PENDING
      }
      if (approvedTime) {
        return TICKET_STAGE.APPROVED
      }
      if (cancelledTime) {
        return TICKET_STAGE.CANCELED
      }
      return TICKET_STAGE.REJECTED
    }

    async function getTaskId() {
      if (ticket.taskId) {
        return ticket.taskId
      }
      const tasks = await shopeeTicketCenterService.getTicketActiveTasks(ticket.id)
      const [firstActiveTask] = tasks
      return (
        // 或签 STC叫做 Everyone to Approve（ETA)，此时handlerType会是ETA，multiInstances是一个数组，每一个审批人有一个TaskId
        firstActiveTask?.multiInstances?.find((multiInstance) => multiInstance.assignee?.email === email)?.id ??
        // 会签 STC叫做 Anyone to Approve (ATA)，此时handlerType会是ATA，multiInstances是null，直接取TaskId
        firstActiveTask?.id
      )
    }

    const applicantId = typeof ticket.variables.applicantId === 'number' ? ticket.variables.applicantId : -1
    const applicantName =
      typeof ticket.variables.applicantName === 'string' ? ticket.variables.applicantName : ticket.starter.username

    // 如果update了 approvedTime cancelledTime 这三个只会有一个是非空值
    const updateTime = approvedTime || cancelledTime || rejectedTime

    const metaInfo: TicketMetaInfo = {
      applicantId,
      applicantName,
      createTime: moment(Number(ticket.startAt)).toISOString(),
      updateTime: updateTime ? moment(Number(updateTime)).toISOString() : '',
      approverList: Array.from(new Set([...approverList, ...rejecterList])),
      assigneeList,
      purpose,
      status: ticket.globalStatus,
      stage: getStage(),
      ticketId: ticket.id,
      displayId: ticket.id,
      ticketType,
      applicantEmail: ticket.starter.email,
    }

    const extraInfo: ShopeeTicketExtraInfo = {
      variables: ticket.variables,
      ticketVersion: 'SHOPEE_TICKET_CENTER',
      title: ticket.title,
      hoursFromCreation: ticket.hoursFromCreation,
      taskId: await getTaskId(),
    }

    const standardTicket = {
      metaInfo,
      extraInfo,
    }
    await this.addExtraInfoForTicket(standardTicket)
    return standardTicket
  }

  private async getShopeeTicketDetails(ticketId: string) {
    const ticket = await this.shopeeTicketCenterService.getTicketDetails(ticketId)
    return this.convertShopeeTicketToTicket(ticket)
  }

  public async getTicket(ticketId: string) {
    const ticketVersion = Ticket.getTicketVersionById(ticketId)
    if (ticketVersion === TICKET_VERSION.SHOPEE_TICKET_CENTER) {
      return this.getShopeeTicketDetails(ticketId)
    }

    if (ticketVersion === TICKET_VERSION.ELASTICSEARCH) {
      return this.elasticTicketService.getTicketDetailById(ticketId)
    }

    throwError(ERROR.SYSTEM_ERROR.TICKET_SERVICE.UNSUPPORTED_TICKET_TYPE)
  }

  public cancelTicket(ticketId: string) {
    const ticketVersion = Ticket.getTicketVersionById(ticketId)
    if (ticketVersion === TICKET_VERSION.SHOPEE_TICKET_CENTER) {
      return this.shopeeTicketCenterService.cancelTicket(ticketId)
    }

    if (ticketVersion === TICKET_VERSION.ELASTICSEARCH) {
      return this.elasticTicketService.cancelTicket(ticketId)
    }

    throwError(ERROR.SYSTEM_ERROR.TICKET_SERVICE.UNSUPPORTED_TICKET_TYPE)
  }

  public updateTicket(ticketId: string, ticketFormVariable: IUpdateShopeeTicketParams) {
    return this.shopeeTicketCenterService.updateTicketForm(ticketId, ticketFormVariable)
  }

  /**
   * 将标准的list query参数转为stc的query参数
   * @private
   */
  private convertListQueryToShopeeTicketCenterListQuery(condition: ListTicketsQuery) {
    const { logger, configService } = this
    const defaultCondition = QUERY_ALL
    const { filterBy } = condition
    const conditions = ListQuery.parseFilterBy(filterBy)?.flat(1) ?? []

    function getStarterCondition() {
      const startUserIdConditions = conditions.filter(
        (condition) => condition.keyPath === 'starter' && condition.operator === '==',
      )

      if (startUserIdConditions.length === 0) {
        return undefined
      }

      if (startUserIdConditions.length !== 1) {
        /**
         * 不可能有多个starter，所以肯定是参数传错了，忽略
         */
        logger.warn('too many starter conditions, skip starter condition')
        return undefined
      }
      return startUserIdConditions?.[0]?.value
    }

    function getTicketTypeCondition() {
      const ticketTypeConditions = conditions.filter(
        (condition) => condition.keyPath === 'metaInfo.ticketType' && condition.operator === '==',
      )
      if (!ticketTypeConditions.length) {
        return {
          title: undefined,
          ticketVersion: undefined,
        }
      }
      if (ticketTypeConditions.length > 1) {
        /**
         * 暂不支持多个ticket类型（STC不支持，产品层面也暂无此需求） 有多个的时候取第一个
         */
        logger.warn('too many ticketType conditions, choose first ticketType condition')
      }
      const ticketType = ticketTypeConditions[0].value
      const PROCESS_CONFIG_PREFIX = `shopeeTicketCenter.processInfo.${ticketType}`
      const title = configService.get<string>(`${PROCESS_CONFIG_PREFIX}.title`)
      /**
       * 因为只能单选类型，所以指定工单类型的时候，stc请求和es请求肯定有一个可以跳过，所以这里返回ticketVersion来方便后面判断
       * 如果不是stc平台工单，则这里processId是undefined
       */
      return {
        title,
        ticketVersion: title === undefined ? TICKET_VERSION.ELASTICSEARCH : TICKET_VERSION.SHOPEE_TICKET_CENTER,
      }
    }

    function getOrderCondition() {
      // 'metaInfo.creatTime.desc' or 'metaInfo.creatTime.asc'
      const orderBy = ListQuery.convertOrderByWithDot(condition.orderBy)
      if (!orderBy) {
        // stc那边感觉不是很靠谱 虽然他们声称不传默认creatTime.desc，还是显式传一下吧
        return SHOPPE_TICKET_LIST_ORDER.START_TIME_DESC
      }

      const shopeeTicketCenterOrderBy = orderBy.replace('metaInfo.createTime', 'startTime')
      if (isOrderSupportedByShopeeTicketCenter(shopeeTicketCenterOrderBy)) {
        return shopeeTicketCenterOrderBy
      }

      logger.warn('orderBy condition is unsupported by shopee ticket center')
      return SHOPPE_TICKET_LIST_ORDER.START_TIME_DESC
    }

    const ticketTypeCondition = getTicketTypeCondition()

    return {
      condition: {
        offset: Number(defaultCondition.offset),
        limit: Number(defaultCondition.limit),
        startUserId: getStarterCondition(),
        ticketGlobalStatus: condition.ticketStatus,
        orderBy: getOrderCondition(),
        ticketType: ticketTypeCondition.title,
      },
      ticketVersion: ticketTypeCondition.ticketVersion,
    }
  }

  /**
   * 向stc请求审批人角度工单，并且封装成标准Ticket
   * @param condition
   * @private
   */
  private async getShopeeApproverTickets(condition: GetTicketListCondition) {
    const isOpened = condition.ticketGlobalStatus === TICKET_STATUS.OPEN
    // 目前stc的task标准接口(getTicketsByApprover) 仅支持opened的task
    const shopeeTicketList = isOpened
      ? await this.shopeeTicketCenterService.getTicketsByApprover(condition)
      : await this.shopeeTicketCenterService.getTicketsByProcessor(condition)
    const total = shopeeTicketList.total
    const items = await Promise.all(
      shopeeTicketList.items.map(async (shopeeTicket) => {
        const ticket = await this.convertShopeeTicketToTicket(shopeeTicket)
        return {
          metaInfo: ticket.metaInfo,
          extraInfo: {
            ...ticket.extraInfo,
            // 当isOpened，这里一定是有值的，当!isOpened，这里一定是undefined
            // 正常情况，这里应该无论isOpened是啥都应该返回taskId, 但是getTicketsByApprover不支持open条件查询，所以只能妥协用getTicketsByProcessor
            // 不过当前端请求已经closed的task时，不需要操作这些task，所以也没啥关系，只有当请求未处理工单的时候需要taskId来执行execTask
            taskId: shopeeTicket.taskId,
          },
        }
      }),
    )
    return { total, items }
  }

  /**
   * 向stc请求请求人角度工单，并且封装成标准Ticket
   * @param condition
   * @private
   */
  private async getShopeeStarterTickets(condition: GetTicketListCondition) {
    const shopeeTicketList = await this.shopeeTicketCenterService.getTicketsByStarter(condition)
    const total = shopeeTicketList.total
    const items = await Promise.all(
      shopeeTicketList.items.map((shopeeTicket) => this.convertShopeeTicketToTicket(shopeeTicket)),
    )
    return {
      total,
      items,
    }
  }

  /**
   * 获取操作人相关的工单列表
   */
  public async listTickets(listTicketsQuery: ListTicketsQuery) {
    const { perspective } = listTicketsQuery
    const { condition, ticketVersion } = this.convertListQueryToShopeeTicketCenterListQuery(listTicketsQuery)

    if (ticketVersion === TICKET_VERSION.SHOPEE_TICKET_CENTER) {
      // 跳过对ES的请求 直接去STC那边请求
      if (perspective === TICKET_PERSPECTIVE.APPROVER) {
        return this.getShopeeApproverTickets(condition)
      }
      return this.getShopeeStarterTickets(condition)
    }

    if (ticketVersion === TICKET_VERSION.ELASTICSEARCH) {
      return this.elasticTicketService.listTickets(listTicketsQuery)
    }

    const { total: shopeeTicketTotal, items: shopeeTickets } =
      perspective === TICKET_PERSPECTIVE.APPROVER
        ? await this.getShopeeApproverTickets(condition)
        : await this.getShopeeStarterTickets(condition)
    const { total: elasticsearchTicketTotal, items: elasticsearchTickets } =
      await this.elasticTicketService.listTickets(listTicketsQuery)

    return {
      total: shopeeTicketTotal + elasticsearchTicketTotal,
      items: [...shopeeTickets, ...elasticsearchTickets],
    }
  }

  public async addExtraInfoForTicket(ticket: Ticket) {
    if (Ticket.isScaleDeploymentTicket(ticket)) {
      const variables = ticket.extraInfo.variables
      const { appName, projectName, tenantId, deployment: deploymentName, phase, clusterId } = variables

      if ([appName, projectName, tenantId, deploymentName, phase, clusterId].some((param) => !param)) {
        this.logger.warn(
          `addExtraInfoForTicket fail for ${ticket.metaInfo.ticketId}, some of deploy info is unknown, skipping`,
        )
        return
      }

      const { cid, clusterName, env } = parseClusterId(clusterId)
      if (!cid || !clusterName || !env) {
        return throwError(
          ERROR.SYSTEM_ERROR.COMMON.PARSE_REQUEST_PARAMS_ERROR,
          'clusterId',
          'clusterId format error, one of cid, clusterName, env is lack',
        )
      }
      const [deploymentDetail] = await tryCatch(
        this.openApiService.getDeploymentDetail({
          cid,
          clusterName,
          env,
          phase,
          appName,
          deploymentName,
          projectName,
          tenantId,
        }),
      )
      // 拉不到的话就算了
      const runtimeReleasePodCount = deploymentDetail?.runningPodCount ?? -1
      const runtimeCanaryPodCount = deploymentDetail?.canaryCount ?? -1
      ticket.extraInfo.variables.runtimeReleasePodCount = runtimeReleasePodCount
      ticket.extraInfo.variables.runtimeCanaryPodCount = runtimeCanaryPodCount
    }
  }

  public async executeTasks(params: UpdateTasksParam, body: UpdateTasksBody, host: string) {
    const { ticketId, taskId } = params
    const { action } = body
    const ticketVersion = Ticket.getTicketVersionById(ticketId)

    if (ticketVersion === TICKET_VERSION.SHOPEE_TICKET_CENTER) {
      const result = await this.shopeeTicketCenterService.executeTasks(action, [{ ticketId, taskId }])
      const { totalCount, successCount, errorInfos } = result

      if (totalCount === successCount && !errorInfos?.length) {
        return {
          failedTasks: [],
        }
      }

      return {
        failedTasks:
          errorInfos?.map((errorInfo) => ({
            taskId: errorInfo.taskId,
            reason: errorInfo.reason,
            ticketId: errorInfo.ticketId,
            ticketTitle: errorInfo.ticketTitle,
          })) ?? [],
      }
    }

    if (ticketVersion === TICKET_VERSION.ELASTICSEARCH) {
      return this.elasticTicketService.processTicket(ticketId, action, host)
    }

    throwError(ERROR.SYSTEM_ERROR.TICKET_SERVICE.UNSUPPORTED_TICKET_TYPE)
  }
}
