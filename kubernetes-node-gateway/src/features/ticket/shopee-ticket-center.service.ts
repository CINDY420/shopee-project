import { constants as HTTP_CONSTANTS } from 'http2'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'

import { Http } from '@/common/utils/http'
import { throwError } from '@/common/utils/throw-error'
import { Logger } from '@/common/utils/logger'
import { ERROR } from '@/common/constants/error'
import { IRequestParams } from '@/common/interfaces/http'
import { AuthService } from '@/shared/auth/auth.service'
import { AuthInfoProvider } from '@/shared/auth/auth-info.provider'

import {
  IShopeeTicketCenterServiceConfig,
  ISTCServerResponse,
  ITokenPayload,
  ShopeeTicket,
} from '@/features/ticket/dto/shopee-ticket-center/shopee-ticket.model'
import { CreateShopeeTicketParams } from '@/features/ticket/dto/shopee-ticket-center/create-ticket.dto'
import { IUpdateShopeeTicketParams } from '@/features/ticket/dto/shopee-ticket-center/update-ticket.dto'
import {
  GetApproverTicketListResponse,
  GetTicketListCondition,
  GetTicketListResponse,
  GetTicketTaskCondition,
} from '@/features/ticket/dto/shopee-ticket-center/get-ticket-list.dto'
import {
  EXECUTE_TASK_ACTION,
  ExecuteTaskParams,
  ExecuteTaskResponse,
  TaskRequestParam,
} from '@/features/ticket/dto/shopee-ticket-center/execute-task.dto'
import { GetTicketEventResponse } from '@/features/ticket/dto/shopee-ticket-center/get-ticket-events.dto'

@Injectable()
export class ShopeeTicketCenterService {
  private readonly config = this.configService.get<IShopeeTicketCenterServiceConfig>('shopeeTicketCenter')!
  private static readonly REQUEST_TOKEN_CACHE_KEY = `${ShopeeTicketCenterService.name}.RequestToken`

  constructor(
    private readonly configService: ConfigService,
    private readonly http: Http,
    private readonly logger: Logger,
    private readonly authService: AuthService,
    private readonly authInfoProvider: AuthInfoProvider,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.logger.setContext(ShopeeTicketCenterService.name)
    if (!this.config) {
      throwError(ERROR.SYSTEM_ERROR.CONFIG_SERVICE.LACK_CONFIG)
    }
    this.http.setBaseURL(this.config.baseUrl)
  }

  private generateBasicAuthorization() {
    return Buffer.from([this.config.appId, this.config.appSecret].join(':')).toString('base64')
  }

  private async getSTCRequestToken() {
    const tokenFromCache = await this.cacheManager.get<string>(ShopeeTicketCenterService.REQUEST_TOKEN_CACHE_KEY)
    if (tokenFromCache) {
      return tokenFromCache
    }
    const [tokenPayload, error] = await this.http.post<ISTCServerResponse<ITokenPayload>>(
      `/app/token?grant_type=client_credentials`,
      null,
      {
        headers: {
          [HTTP_CONSTANTS.HTTP2_HEADER_CONTENT_TYPE]: 'application/x-www-form-urlencoded',
          [HTTP_CONSTANTS.HTTP2_HEADER_AUTHORIZATION]: `Basic ${this.generateBasicAuthorization()}`,
        },
        timeout: this.configService.get<number>('global.stc-timeout'),
      },
    )
    if (error || !tokenPayload?.data) {
      this.logger.error(`get stc token failed: ${error?.stack}`)
      throwError(ERROR.REMOTE_SERVICE_ERROR.SHOPEE_TICKET_CENTER_ERROR.GET_TOKEN_FAILED)
    }
    const token = tokenPayload.data.access_token
    const timeOut = Number(tokenPayload?.data.expires_in ?? 0) // expires_in eg: "2592000"
    await this.cacheManager.set(ShopeeTicketCenterService.REQUEST_TOKEN_CACHE_KEY, token, { ttl: timeOut })

    return tokenPayload.data.access_token
  }

  private async request<
    TResponseBody = unknown,
    TRequestParams = URLSearchParams,
    TRequestBody = Record<string, unknown>,
  >(
    requestParams: Omit<IRequestParams<TRequestParams, TRequestBody>, 'token' | 'baseURL' | 'apiVersion'>,
    retryTime = 0,
  ): Promise<TResponseBody> {
    const MAX_RETRY_TIME = 2
    if (retryTime >= MAX_RETRY_TIME) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.SHOPEE_TICKET_CENTER_ERROR.SERVICE_IS_NOT_AVAILABLE,
        `get stc failed for ${MAX_RETRY_TIME} times`,
      )
    }
    const { method, body, query, resourceURI, headers: incomingHeaders } = requestParams

    const token = await this.getSTCRequestToken()
    const headers = {
      [HTTP_CONSTANTS.HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
      [HTTP_CONSTANTS.HTTP2_HEADER_AUTHORIZATION]: `Bearer ${token}`,
      // operator: 'zebin.lu@shopee.com',
      // operator: 'jiyao.hong@shopee.com',
      operator: this.authInfoProvider.getAuthUser()?.Email ?? '',
      ...incomingHeaders,
    }

    const options = {
      url: resourceURI,
      method,
      searchParams: query ?? {},
      headers,
      json: body,
      timeout: Number(this.configService.get<string>('global.stc-timeout')),
    }
    this.logger.log(`stc request: ${JSON.stringify(options, null, 4)}`)
    const [result, error] = await this.http.request<ISTCServerResponse<TResponseBody>>(options)
    const errorBody = error?.response?.body
    const errorStatus = error?.response?.statusCode
    const errorText = typeof errorBody === 'string' ? errorBody : ''

    if (errorText.indexOf('Token verification failed') >= 0) {
      this.logger.warn(`Token verification failed, retrying the ${retryTime + 1} time`)
      await this.cacheManager.del(ShopeeTicketCenterService.REQUEST_TOKEN_CACHE_KEY)
      return this.request<TResponseBody, TRequestParams, TRequestBody>(requestParams, retryTime + 1)
    }

    if (errorStatus === 404) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.SHOPEE_TICKET_CENTER_ERROR.TICKET_NOT_FOUND)
    }

    if (error || !result) {
      throwError(ERROR.REMOTE_SERVICE_ERROR.SHOPEE_TICKET_CENTER_ERROR.TICKET_OPERATION_FAILED, errorText)
    }
    return result.data
  }

  public createTicket<TFormType = unknown>(ticket: CreateShopeeTicketParams<TFormType>) {
    return this.request<ShopeeTicket<TFormType>, never, CreateShopeeTicketParams<TFormType>>({
      method: 'POST',
      resourceURI: '/tickets',
      body: ticket,
    })
  }

  public getTicketDetails<TFormType = unknown>(ticketId: string) {
    return this.request<ShopeeTicket<TFormType>>({
      method: 'GET',
      resourceURI: `/tickets/${ticketId}`,
    })
  }

  public getTicketEvents(ticketId: string) {
    return this.request<GetTicketEventResponse>({
      method: 'GET',
      resourceURI: `/tickets/${ticketId}/eventLogs`,
    })
  }

  public cancelTicket(ticketId: string) {
    return this.request<void>({
      method: 'POST',
      resourceURI: `/tickets/${ticketId}/cancel`,
    })
  }

  public updateTicketForm(ticketId: string, ticketFormVariable: IUpdateShopeeTicketParams) {
    return this.request<IUpdateShopeeTicketParams>({
      method: 'PUT',
      resourceURI: `/tickets/${ticketId}/variables`,
      body: ticketFormVariable,
    })
  }

  /**
   * 获取"我"创建的工单，因为request方法的header是有operator的，所以不需要指定starter，starter是按operator来的
   */
  public getTicketsByStarter(condition: GetTicketListCondition) {
    return this.request<
      GetTicketListResponse,
      GetTicketListCondition & { involvedType: 'startedBy'; ticketSource: string }
    >({
      method: 'GET',
      resourceURI: '/user/tickets',
      query: {
        ...condition,
        involvedType: 'startedBy',
        ticketSource: this.configService.get<string>('shopeeTicketCenter.appName') ?? '',
      },
    }).then((result) => ({
      total: Number(result.total),
      items: result.items,
    }))
  }

  /**
   * 获取"我"处理过的工单
   */
  public getTicketsByProcessor(condition: GetTicketListCondition) {
    return this.request<
      GetTicketListResponse,
      GetTicketListCondition & { involvedType: 'processedBy'; ticketSource: string }
    >({
      method: 'GET',
      resourceURI: '/user/tickets',
      query: {
        ...condition,
        involvedType: 'processedBy',
        ticketSource: this.configService.get<string>('shopeeTicketCenter.appName') ?? '',
      },
    }).then((result) => ({
      total: Number(result.total),
      items: result.items,
    }))
  }

  /**
   * 获取"我"需要审批的工单，因为request方法的header是有operator的，所以不需要指定approver，approver是按operator来的
   */
  public getTicketsByApprover(condition: GetTicketListCondition) {
    return this.request<GetApproverTicketListResponse, GetTicketTaskCondition & { ticketSource: string }>({
      method: 'GET',
      resourceURI: '/user/tasks',
      query: {
        ...condition,
        orderBy: GetTicketTaskCondition.convertOrderFromTicketOrder(condition.orderBy),
        ticketSource: this.configService.get<string>('shopeeTicketCenter.appName') ?? '',
      },
    }).then((result) => ({
      total: Number(result.total),
      items: result.items.map((item) => ({
        ...item.ticketInfo,
        taskId: item.id,
      })),
    }))
  }

  /**
   * （批量）同意 / 拒绝 Task, Task 就是审批人视角的 ticket，不过一个 Ticket 可以有多个 task
   *
   * @param action 同意 / 拒绝
   * @param taskInfoList 任务信息 包含ticket的id和task的id
   */
  public executeTasks(action: EXECUTE_TASK_ACTION, taskInfoList: TaskRequestParam[]) {
    return this.request<ExecuteTaskResponse, never, ExecuteTaskParams>({
      method: 'POST',
      resourceURI: '/tasks/batchExecute',
      body: {
        tag: action,
        taskReqParams: taskInfoList,
      },
    })
  }

  /**
   * 获取单个ticket相关的可以审批的task
   */
  public getTicketActiveTasks(ticketId: string) {
    return this.request<
      {
        id: string
        multiInstances?: {
          id: string
          assignee: {
            email: string
          }
        }[]
      }[],
      never,
      never
    >({
      method: 'GET',
      resourceURI: `/tickets/${ticketId}/activeTasks`,
    })
  }
}
