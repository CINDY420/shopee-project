import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SpaceAuthService } from '@infra-node-kit/space-auth'
import { tryGetMessage } from '@/common/utils/try-get-message'
import { tryCatch } from '@/common/utils/try-catch'
import { throwError } from '@/common/utils/throw-error'
import { IRequestParams } from '@/common/interfaces/http'
import { HttpService } from '@infra-node-kit/http'
import { CustomException } from '@infra-node-kit/exception/dist/models/custom-exception'
import { AxiosResponse } from 'axios'
import {
  IGetUserInfoByTokenResponse,
  IGetUserProfileResponse,
  IGetServiceResponse,
  ICreateTicketBody,
  ICreateTicketResponse,
  IGetCheckCodeFreezeResponse,
  IGetSWPTicketResponse,
  IUpdateDeployPathBody,
  IUpdateDeployConfigurationBody,
  ICreateFEWorkbenchAppBody,
  ICreateFEWorkbenchAppResponse,
  IImportJenkinsBody,
  IQuerySWPTicketBody,
  IQuerySWPTicketResponse,
  IGetAlbListenerQuery,
  IGetAlbListenerResponse,
  ICreateAlbListenerBody,
  ICreateSWPTicketresponse,
  ICreateSWPTicketBody,
} from '@/shared/space-api/interfaces/space-api'
import { ERROR } from '@/common/constants/error'

@Injectable()
export class SpaceApiService {
  private readonly spaceBaseUrl = this.configService.get<string>('spaceBaseUrl')!

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly authService: SpaceAuthService,
  ) {}

  private async request<
    TResponseBody = unknown,
    TRequestParams = URLSearchParams,
    TRequestBody = Record<string, unknown>,
  >(requestParams: Omit<IRequestParams<TRequestParams, TRequestBody>, 'baseURL'>) {
    const {
      method,
      body,
      query,
      resourceURI,
      headers: incomingHeaders,
      token,
      errorPath,
    } = requestParams
    const [response, error] = await tryCatch<AxiosResponse<TResponseBody>, CustomException>(
      this.httpService.request({
        baseURL: this.spaceBaseUrl,
        method,
        url: resourceURI,
        params: query,
        data: body,
        headers: {
          Authorization: token || this.authService.getUser()?.auth || '',
          ...incomingHeaders,
        },
      }),
    )
    if (error) {
      const errorMessage = tryGetMessage(error?.response?.data, errorPath || 'message')
      throwError(ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR, errorMessage)
    }
    return response?.data
  }

  getServiceById(param: { token?: string; serviceId: number }) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return this.request<IGetServiceResponse, { service_id: number }>({
      token: param.token,
      method: 'GET',
      resourceURI: 'apis/cmdb/v2/service/get_by_id',
      query: {
        service_id: param.serviceId,
      },
      errorPath: 'error_detailed',
    })
  }

  getServiceByName(param: { token?: string; serviceName: string }) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return this.request<IGetServiceResponse, { service_name: string }>({
      token: param.token,
      method: 'GET',
      resourceURI: 'apis/cmdb/v2/service/get_by_name',
      query: {
        service_name: param.serviceName,
      },
      errorPath: 'error_detailed',
    })
  }

  getUserProfile(param: { token?: string; userId: number }) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return this.request<IGetUserProfileResponse, { user_id: number }>({
      token: param.token,
      method: 'GET',
      resourceURI: 'apis/uic/v1/user/get',
      query: {
        user_id: param.userId,
      },
    })
  }

  getUserInfoByToken(authorization: string) {
    return this.request<IGetUserInfoByTokenResponse>({
      method: 'POST',
      resourceURI: '/apis/uic/v2/auth/token_validate',
      headers: {
        authorization,
      },
    })
  }

  createTicket(param: { token?: string; body: ICreateTicketBody }) {
    return this.request<ICreateTicketResponse, unknown, ICreateTicketBody>({
      token: param.token,
      method: 'POST',
      resourceURI: '/apis/osp/v1/ticket/create',
      body: param.body,
    })
  }

  checkCodeFreeze(token?: string) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return this.request<IGetCheckCodeFreezeResponse, { with_campaign_info: boolean }>({
      token,
      method: 'GET',
      resourceURI: '/apis/deploy/v1/pipeline/get_overview',
      query: {
        with_campaign_info: true,
      },
    })
  }

  getSWPTicket(param: { token?: string; ticketId: number }) {
    return this.request<IGetSWPTicketResponse, { id: number }>({
      token: param.token,
      method: 'GET',
      resourceURI: '/apis/swp/v1/ticket/get',
      query: {
        id: param.ticketId,
      },
    })
  }

  querySWPTicket(param: { token?: string; body: IQuerySWPTicketBody }) {
    return this.request<IQuerySWPTicketResponse, unknown, IQuerySWPTicketBody>({
      token: param.token,
      method: 'POST',
      resourceURI: '/apis/swp/v2/ticket/query',
      body: param.body,
    })
  }

  createSWPTicket(param: { token?: string; body: ICreateSWPTicketBody }) {
    return this.request<ICreateSWPTicketresponse, unknown, ICreateSWPTicketBody>({
      token: param.token,
      method: 'POST',
      resourceURI: '/apis/swp/v1/ticket/create',
      body: param.body,
    })
  }

  updateService(param: { token?: string; serviceId: number; gitRepoLink: string }) {
    return this.request({
      token: param.token,
      method: 'POST',
      resourceURI: '/apis/cmdb/v2/service/update',
      body: {
        service_id: param.serviceId,
        git_link: param.gitRepoLink,
      },
      errorPath: 'error_detailed',
    })
  }

  updateDeployPath(param: { token?: string; body: IUpdateDeployPathBody }) {
    return this.request({
      token: param.token,
      method: 'POST',
      resourceURI: '/apis/deploy/v1/pipeline/config/jenkins/update',
      body: param.body,
    })
  }

  updateDeployConfiguration(param: { token?: string; body: IUpdateDeployConfigurationBody }) {
    return this.request({
      token: param.token,
      method: 'POST',
      resourceURI: '/apis/cmdb/v1/depconf/commit/create',
      body: param.body,
      errorPath: 'error_detailed',
    })
  }

  createFEWorkbenchApp(param: { token?: string; body: ICreateFEWorkbenchAppBody }) {
    return this.request<ICreateFEWorkbenchAppResponse, unknown, ICreateFEWorkbenchAppBody>({
      token: param.token,
      method: 'POST',
      resourceURI: '/api/workbench/app/create',
      body: param.body,
    })
  }

  getServiceJobs(param: { token?: string; serviceId: number }) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return this.request<{ result: { service_jobs: any } }, { service_id: number }>({
      token: param.token,
      method: 'GET',
      resourceURI: '/apis/deploy/v1/service_job/get_jobs',
      query: {
        service_id: param.serviceId,
      },
    })
  }

  importJenkins(param: { token?: string; body: IImportJenkinsBody }) {
    return this.request<ICreateFEWorkbenchAppResponse, unknown, IImportJenkinsBody>({
      token: param.token,
      method: 'POST',
      resourceURI: '/api/workbench/app/import_jenkins',
      body: param.body,
    })
  }

  getAlbListener(param: { token?: string; query: IGetAlbListenerQuery }) {
    return this.request<IGetAlbListenerResponse, IGetAlbListenerQuery>({
      token: param.token,
      method: 'GET',
      resourceURI: '/apis/alb/v2/listener/query',
      query: param.query,
      errorPath: 'error.message',
    })
  }

  createAlbListener(param: { token?: string; body: ICreateAlbListenerBody }) {
    return this.request<IGetAlbListenerResponse, unknown, ICreateAlbListenerBody>({
      token: param.token,
      method: 'POST',
      resourceURI: '/apis/alb/v2/listener/create',
      body: param.body,
      errorPath: 'error.message',
    })
  }
}
