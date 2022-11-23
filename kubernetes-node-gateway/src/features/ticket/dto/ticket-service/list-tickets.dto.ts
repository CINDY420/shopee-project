import { IsEnum, IsOptional, IsString, Matches } from 'class-validator'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
import { Ticket, TICKET_PERSPECTIVE, TICKET_STATUS } from '@/features/ticket/dto/ticket-service/ticket.model'

export class ListTicketsQuery extends ListQuery {
  @IsEnum(TICKET_PERSPECTIVE)
  perspective: TICKET_PERSPECTIVE

  @IsOptional()
  @IsEnum(TICKET_STATUS)
  ticketStatus?: TICKET_STATUS

  /**
   * 目前仅支持过滤申请人和工单类型
   * @example 'starter==xxx@shopee.com;ticketType=DEPLOYMENT_SCALE'
   */
  @IsOptional()
  @IsString()
  filterBy?: string

  /**
   * orderBy暂时只支持按创建时间排序 默认'metaInfo.creatTime desc'
   * @example 'metaInfo.creatTime desc'
   */
  @IsOptional()
  @IsString()
  @Matches(/^metaInfo.createTime( desc)?$/)
  orderBy?: string
}

export class GetTicketsResponse {
  total: number
  items: Ticket[]
}
