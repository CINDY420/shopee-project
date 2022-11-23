import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'
import { ApiExtraModels, ApiProperty, getSchemaPath, IntersectionType, PickType } from '@nestjs/swagger'
import {
  ScaleDeploymentTicketForm,
  ShopeeTicket,
  ShopeeTicketMetaVariables,
} from '@/features/ticket/dto/shopee-ticket-center/shopee-ticket.model'
import { ElasticsearchTicketDetail } from '@/features/ticket/dto/elasticsearch-ticket-service/elasticsearch-ticket.model'

export enum TICKET_TYPE {
  DEPLOYMENT_SCALE = 'DEPLOYMENT_SCALE',
  TERMINAL = 'TERMINAL',
  CHANGE_ROLE = 'CHANGE_ROLE',
  ADD_ROLE = 'ADD_ROLE',
}
export function isKnownTicketType(type: unknown): type is TICKET_TYPE {
  return Object.values(TICKET_TYPE).includes(type as TICKET_TYPE)
}

export enum TICKET_VERSION {
  ELASTICSEARCH = 'ELASTICSEARCH',
  SHOPEE_TICKET_CENTER = 'SHOPEE_TICKET_CENTER',
}

export enum TICKET_STATUS {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum ELASTIC_TICKET_STAGE {
  PENDING = 'PENDING',
  // closed有三种情况
  CANCELED = 'CANCELLED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

export enum TICKET_STAGE {
  PENDING = 'Pending',
  // closed有三种情况
  CANCELED = 'Canceled',
  REJECTED = 'Rejected',
  APPROVED = 'Approved',
}

export enum TICKET_PERSPECTIVE {
  STARTER = 'STARTER',
  APPROVER = 'APPROVER',
}

/**
 * 旧有的存入Elasticsearch的工单的独有信息
 */
export class ElasticsearchTicketExtraInfo extends PickType(ElasticsearchTicketDetail, [
  'tenantId',
  'tenantName',
  'project',
  'permissionGroupId',
  'permissionGroupName',
]) {
  ticketVersion: 'ELASTICSEARCH'
}

/**
 * STC工单独有信息
 */
export class ShopeeTicketExtraInfo extends PickType(ShopeeTicket, [
  'variables',
  'taskId',
  'title',
  'hoursFromCreation',
]) {
  /**
   * @example 'SHOPEE_TICKET_CENTER'
   */
  ticketVersion: 'SHOPEE_TICKET_CENTER'
}

export class ScaleDeploymentTicketExtraInfo {
  @IsString()
  @IsNotEmpty()
  tenantId: string

  @IsString()
  @IsNotEmpty()
  projectName: string

  @IsString()
  @IsNotEmpty()
  appName: string

  @IsString()
  @IsNotEmpty()
  appInstanceName: string

  @IsBoolean()
  canaryValid: boolean

  @IsString()
  @IsNotEmpty()
  phase: string
}

/**
 * 申请容器伸缩的工单的variables字段
 */
class ShopeeScaleDeploymentTicketExtraInfoVariables extends IntersectionType(
  IntersectionType(ScaleDeploymentTicketForm, ScaleDeploymentTicketExtraInfo),
  ShopeeTicketMetaVariables,
) {
  auditResponse?: string
}

/**
 * 容器伸缩工单独有信息
 */
export class ShopeeScaleDeploymentTicketExtraInfo extends ShopeeTicketExtraInfo {
  variables: ShopeeScaleDeploymentTicketExtraInfoVariables
}

/**
 * 所有工单的标准信息
 */
export class TicketMetaInfo {
  /**
   * 工单id
   */
  ticketId: string
  /**
   * 显示工单id
   */
  displayId: string
  /**
   * 工单类型
   */
  ticketType: TICKET_TYPE
  /**
   * 状态
   */
  status: TICKET_STATUS
  /**
   * 阶段
   */
  stage: TICKET_STAGE
  /**
   * 申请理由
   */
  purpose: string
  /**
   * 点通过或者拒绝的人在k8s平台的名字
   * 由于可能有多个审批过程 所以是数组
   */
  approverList: string[]
  /**
   * 审批人列表
   */
  assigneeList: string[]
  /**
   * 点通过/拒绝/被取消的时间
   */
  updateTime: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 申请人email
   */
  applicantEmail: string
  /**
   * 申请人在k8s平台的id
   */
  applicantId: number
  /**
   * 申请人在k8s平台的名字
   */
  applicantName: string
}

/**
 * 工单统一结构
 */
@ApiExtraModels(ShopeeScaleDeploymentTicketExtraInfo)
@ApiExtraModels(ElasticsearchTicketExtraInfo)
export class Ticket {
  metaInfo: TicketMetaInfo

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ElasticsearchTicketExtraInfo) },
      { $ref: getSchemaPath(ShopeeScaleDeploymentTicketExtraInfo) },
    ],
    description:
      '其他工单相关信息，不同类型不一样（通过ticketVersion字段可以判断是不是STC工单，只要不需要遍历枚举metaInfo里的TICKET_TYPE)',
  })
  extraInfo: ElasticsearchTicketExtraInfo | ShopeeTicketExtraInfo

  public static getTicketVersionById(ticketId: string) {
    const SHOPEE_TICKET_CENTER_TICKET_PREFIX_LIST = ['DEPLOYMENTSCALE']
    if (SHOPEE_TICKET_CENTER_TICKET_PREFIX_LIST.some((prefix) => ticketId.startsWith(prefix))) {
      return TICKET_VERSION.SHOPEE_TICKET_CENTER
    }
    return TICKET_VERSION.ELASTICSEARCH
  }

  public static isScaleDeploymentTicket(ticket: Ticket): ticket is ShopeeScaleDeploymentTicket {
    return ticket.metaInfo.ticketType === TICKET_TYPE.DEPLOYMENT_SCALE
  }
}

export class ShopeeScaleDeploymentTicket extends Ticket {
  extraInfo: ShopeeScaleDeploymentTicketExtraInfo
}
