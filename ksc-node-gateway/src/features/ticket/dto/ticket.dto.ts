import { SRE_TICKET_STATUS } from '@/common/constants/sre-ticket'

export class ListUserSreTicketsParams {
  email: string
}

export class ListUserSreTicketsQuery {
  status?: SRE_TICKET_STATUS
}

class UserSreTicket {
  status: SRE_TICKET_STATUS
  is_timeout: boolean
}

export class ListUserSreTicketsResponse {
  total: number
  items: UserSreTicket[]
}
