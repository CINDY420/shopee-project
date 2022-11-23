/**
 * @see https://confluence.shopee.io/pages/viewpage.action?pageId=644068169#heading-63Listuserstasks
 */

import { OmitType } from '@nestjs/swagger'
import { ShopeeTicket } from '@/features/ticket/dto/shopee-ticket-center/shopee-ticket.model'
import { TICKET_STATUS } from '@/features/ticket/dto/ticket-service/ticket.model'

export enum SHOPPE_TICKET_LIST_ORDER {
  START_TIME_ASC = 'startTime.asc',
  START_TIME_DESC = 'startTime.desc',
}

export function isOrderSupportedByShopeeTicketCenter(order?: string): order is SHOPPE_TICKET_LIST_ORDER {
  const values = Object.values(SHOPPE_TICKET_LIST_ORDER)
  return values.includes(order as SHOPPE_TICKET_LIST_ORDER)
}

export enum SHOPPE_TASK_LIST_ORDER {
  CREATE_TIME_ASC = 'createTime',
  CREATE_TIME_DESC = 'createTime.desc',
}

export class GetTicketListCondition {
  offset?: number
  limit?: number
  startUserId?: string
  // Process definition name
  ticketType?: string
  ticketGlobalStatus?: TICKET_STATUS
  orderBy?: SHOPPE_TICKET_LIST_ORDER
}

export class GetTicketTaskCondition extends OmitType(GetTicketListCondition, ['orderBy']) {
  orderBy?: SHOPPE_TASK_LIST_ORDER

  static convertOrderFromTicketOrder(order?: SHOPPE_TICKET_LIST_ORDER) {
    if (!order) {
      return undefined
    }
    if (order === SHOPPE_TICKET_LIST_ORDER.START_TIME_ASC) {
      return SHOPPE_TASK_LIST_ORDER.CREATE_TIME_ASC
    }
    if (order === SHOPPE_TICKET_LIST_ORDER.START_TIME_DESC) {
      return SHOPPE_TASK_LIST_ORDER.CREATE_TIME_DESC
    }
  }
}

export class GetApproverTicketListResponse {
  items: {
    ticketInfo: ShopeeTicket
    id: string
  }[]

  total: string
}

export class GetTicketListResponse {
  items: ShopeeTicket[]
  total: string
}
