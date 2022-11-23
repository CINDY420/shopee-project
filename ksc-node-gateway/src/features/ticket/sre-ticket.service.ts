import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { constants as HTTP_CONSTANTS } from 'http2'

import { Http, extractResponseErrorMessage } from '@/common/utils/http'
import { ISreTicketConfig } from '@/common/interfaces/config.interface'
import { IRequestParams } from '@/common/interfaces/http.interface'
import { Logger } from '@/common/utils/logger'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'
import {
  CreateSreAddRoleTicketBody,
  CreateSreAddRoleTicketBodyWrapper,
  ListSreTicketQuery,
  ListSreTicketResponse,
} from '@/features/ticket/dto/sre-ticket.dto'
import { SRE_TICKET_EMERGENCY_NAME, DEPARTMENT_ID } from '@/common/constants/sre-ticket'

@Injectable()
export class SreTicketService {
  constructor(private configService: ConfigService, public readonly http: Http, private readonly logger: Logger) {
    this.logger.setContext(SreTicketService.name)

    const sreTicketConfig = this.configService.get<ISreTicketConfig>('sreTicket')
    const { protocol, host, prefix } = sreTicketConfig || {}
    const serverUrl = `${protocol}://${host}`
    const serverUrlPrefix = prefix ? `${serverUrl}/${prefix}` : serverUrl
    const serverUrlPrefixVersion = `${serverUrlPrefix}/v2`
    // Init sreTicket client
    this.http.setServerConfiguration({
      serverName: SreTicketService.name,
      baseUrl: serverUrlPrefixVersion,
    })
  }

  private async request<
    TResponseBody = unknown,
    TRequestParams = URLSearchParams,
    TRequestBody = Record<string, unknown>,
  >(requestParams: IRequestParams<TRequestParams, TRequestBody>): Promise<TResponseBody> {
    const { method, body, query, resourceURI, headers: incomingHeaders } = requestParams
    const sreTicketConfig = this.configService.get<ISreTicketConfig>('sreTicket')
    const { token } = sreTicketConfig || {}
    const tokenHeader = token ? { [HTTP_CONSTANTS.HTTP2_HEADER_AUTHORIZATION]: token } : {}
    const headers = {
      [HTTP_CONSTANTS.HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
      ...tokenHeader,
      ...incomingHeaders,
    }

    const [result, error] = await this.http.request<TResponseBody>({
      url: resourceURI,
      method,
      searchParams: query ?? {},
      headers,
      json: body,
    })

    if (error || !result) {
      const errorStatus = error?.response?.statusCode
      const errorBody = error?.response?.body
      const errorMessage = extractResponseErrorMessage(errorBody, 'message')

      throwError(
        {
          ...ERROR.REMOTE_SERVICE_ERROR.SRE_TICKET_ERROR.UNKNOWN_ERROR,
          status: errorStatus ?? HttpStatus.SERVICE_UNAVAILABLE,
        },
        errorMessage,
      )
    }

    return result
  }

  public createSreAddRoleTicket(createSreAddRoleTicketBody: CreateSreAddRoleTicketBody) {
    return this.request<unknown, unknown, CreateSreAddRoleTicketBodyWrapper>({
      method: 'POST',
      resourceURI: '/order/',
      body: {
        ...createSreAddRoleTicketBody,
        department: DEPARTMENT_ID, // 固定值,测试环境139，live是148。部门id，sre工单系统提供
        emergency_name: SRE_TICKET_EMERGENCY_NAME.NORMAL, // 固定值'Normal', sre工单系统提供
        order_type: 5, // 固定值5。来源工单类型id，sre工单系统提供
      },
    })
  }

  public listSreTickets(listSreTicketQuery: ListSreTicketQuery) {
    return this.request<ListSreTicketResponse, ListSreTicketQuery, never>({
      method: 'GET',
      resourceURI: '/order/',
      query: listSreTicketQuery,
    })
  }
}
