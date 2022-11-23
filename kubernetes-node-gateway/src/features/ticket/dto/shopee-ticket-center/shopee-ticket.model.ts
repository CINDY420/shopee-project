/**
 * @see https://confluence.shopee.io/display/IPG/STC+-+User+Task#STCUserTask-BasicConfigurationofUserTask
 * @see https://confluence.shopee.io/pages/viewpage.action?pageId=776550771
 * @see https://confluence.shopee.io/pages/viewpage.action?pageId=644068169
 */
import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { TICKET_STATUS } from '@/features/ticket/dto/ticket-service/ticket.model'

export class IShopeeTicketCenterServiceConfig {
  appId: number
  appSecret: string
  baseUrl: string
}

export class ITokenPayload {
  access_token: string
  expires_in: string
  token_type: string
}

export class ISTCServerResponse<TPayload> {
  code: number
  data: TPayload
  message: string
}

export class ShopeeTicketStarter {
  sourceFrom: string
  username: string
  email: string
  teamInfo: string
  avatarUrl: string
  identityToken: string
  seaTalkProfile?: unknown
}

export class ShopeeTicketMetaVariables {
  runtimeReleasePodCount?: number
  runtimeCanaryPodCount?: number
  /* eslint-disable @typescript-eslint/naming-convention */
  @ApiProperty({ description: '' })
  __STC_TICKET_TITLE: string

  __STC_CREATE_STATUS: string
  __STC_TICKET_APP_NAME: string
  __STC_TICKET_GLOBAL_STATUS: string
  __STC_TICKET_SOURCE: string
  __STC_TICKET_VISIBLE: boolean
  __STC_TICKET_APP_ID: number
  __STC_TICKET_ID: string
  __STC_CREATOR_TEAM: string
  __STC_CREATOR: string
  // typo: _ACTIVITY_SKIP_EXPRESSION_ENABLED
  _ACTIVITI_SKIP_EXPRESSION_ENABLED: boolean
  __STC_TICKET_STATUS: string
  __STC_TICKET_TYPE: string;
  /* eslint-enable @typescript-eslint/naming-convention */

  // and some key-values from bound form 另外，form表单信息也会被塞进这里
  [key: string]: string | number | boolean | string[] | undefined
}

export class ShopeeTicket<TFormProperty = unknown> {
  id: string
  title: string
  type: string
  /**
   * 进行到哪个task了
   */
  status: string
  /**
   * 整个工单的状态
   */
  globalStatus: TICKET_STATUS
  // 申请人id
  startUserId: string
  appName: string
  appId: number
  startAt: string // timestamp(ms)
  endAt?: string // timestamp(ms)
  hoursFromCreation: number
  starter: ShopeeTicketStarter
  isAbnormal?: boolean
  variables: ShopeeTicketMetaVariables & TFormProperty
  buttonList?: unknown[]
  processInstanceId: string
  processDefinitionKey: string
  processDefinitionId: string
  processDefinitionName: string
  formInfo?: unknown
  /**
   * 当且仅当审批人视角有taskId，因为一个STC工单可能有多个task 所以要taskId + ticketId才能确定一个审批单
   */
  taskId?: string
}

export class ScaleDeploymentTicketForm {
  @IsString()
  deployment: string

  @IsString()
  clusterId: string

  @IsInt()
  @Min(0)
  currentReleasePodCount: number

  @IsInt()
  @Min(0)
  targetReleasePodCount: number

  @IsInt()
  @Min(0)
  @IsOptional()
  currentCanaryPodCount?: number

  @IsInt()
  @Min(0)
  @IsOptional()
  targetCanaryPodCount?: number

  @IsString()
  purpose: string
}

export class TaskApproverData {
  approver: string
  taskId: string
  taskName: string
  taskDefinitionKey: string
}

export class TicketEvent {
  creator: ShopeeTicketStarter
  eventType: string
  ticketId: string
  createTime: string
  createdAt: string
  data: unknown

  public static isTaskApprovedEvent(event: TicketEvent): event is TicketApproverEvent {
    return event.eventType === 'TicketTaskApproved'
  }

  public static isTicketApprovedEvent(event: TicketEvent) {
    return event.eventType === 'TicketApproved'
  }

  public static isTicketCanceledEvent(event: TicketEvent) {
    return event.eventType === 'TicketCanceled'
  }

  public static isTicketRejectedEvent(event: TicketEvent): event is TicketRejectedEvent {
    return event.eventType === 'TicketRejected'
  }

  public static isTicketTaskRejectedEvent(event: TicketEvent): event is TicketTaskRejectedEvent {
    return event.eventType === 'TicketTaskRejected'
  }
}

export class TicketApproverEvent extends TicketEvent {
  eventType: 'TicketTaskApproved'
  data: TaskApproverData
}

export class TicketRejectedEvent extends TicketEvent {
  eventType: 'TicketRejected'
  data: {
    operator: string
  }
}

export class TicketTaskRejectedEvent extends TicketEvent {
  eventType: 'TicketTaskRejected'
  data: {
    operator: string
    taskId: string
    taskName: string
    taskDefinitionKey: string
  }
}
