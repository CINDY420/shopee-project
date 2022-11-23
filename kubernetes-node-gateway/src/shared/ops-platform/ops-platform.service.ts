import { constants as HTTP_CONSTANTS } from 'http2'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'
import { Http } from '@/common/utils/http'
import { Logger } from '@/common/utils/logger'
import { IServiceURLConfig } from '@/common/interfaces/config'
import { IRequestParams } from '@/common/interfaces/http'
import { AuthService } from '@/shared/auth/auth.service'
import { AuthInfoProvider } from '@/shared/auth/auth-info.provider'
import { throwError } from '@/common/utils/throw-error'
import { tryGetMessage } from '@/common/utils/try-get-message'
import { ERROR } from '@/common/constants/error'
import { IOpsPlatformResponse } from '@/shared/ops-platform/ops-platform.model'
import { LabelNode } from '@/features/sdu-resource/entities/label.entity'
import { EditIncrementEstimateBody } from '@/features/sdu-resource/dto/edit-increment-estimate.dto'
import { EditStockResourceBody } from '@/features/sdu-resource/dto/edit-stock-resource.dto'
import { OpenApiStock } from '@/features/sdu-resource/entities/stock.entity'
import { ListOpenApiStockQuery } from '@/features/sdu-resource/dto/list-stock-resource.dto'
import { Version } from '@/features/sdu-resource/entities/version.entity'
import { Summary } from '@/features/sdu-resource/entities/summary.entity'
import { CreateVersionBody } from '@/features/sdu-resource/dto/create-version.dto'
import { CreateIncrementEstimateBody } from '@/features/sdu-resource/dto/create-increment-estimate.dto'
import { BigSale } from '@/features/sdu-resource/entities/big-sale.entity'
import { ListIncrementQuery } from '@/features/sdu-resource/dto/list-increment-resource.dto'
import { OpenApiIncrement } from '@/features/sdu-resource/entities/increment.entity'
import { ListSummaryQuery } from '@/features/sdu-resource/dto/list-summary.dto'
import { EditVersionBody } from '@/features/sdu-resource/dto/edit-version.dto'

@Injectable()
export class OpsPlatformService {
  private readonly opsPlatformConfig = this.configService.get<IServiceURLConfig>('opsPlatform')!

  constructor(
    private readonly configService: ConfigService,
    private readonly http: Http,
    private readonly logger: Logger,
    private readonly authService: AuthService,
    private readonly authInfoProvider: AuthInfoProvider,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    logger.setContext(OpsPlatformService.name)
    const { protocol, port, host } = this.opsPlatformConfig
    const openApiServerURL = `${port ? `${protocol}://${host}:${port}` : `${protocol}://${host}`}/admin/`
    this.http.setBaseURL(openApiServerURL)
  }

  private async request<
    TResponseBody = unknown,
    TRequestParams = URLSearchParams,
    TRequestBody = Record<string, unknown>,
  >(requestParams: Omit<IRequestParams<TRequestParams, TRequestBody>, 'token' | 'baseURL'>) {
    const { method, body, query, resourceURI, headers: incomingHeaders, apiVersion } = requestParams
    const token = this.authInfoProvider.getAuthToken()
    const tokenHeaders = token ? { [HTTP_CONSTANTS.HTTP2_HEADER_AUTHORIZATION]: `Bearer ${token}` } : {}

    const timeout = this.configService.get<number>('global.ops-platform-timeout')
    const [result, error] = await this.http.request<IOpsPlatformResponse<TResponseBody>>({
      url: `${apiVersion}/${resourceURI}`,
      method,
      searchParams: query ?? {},
      headers: {
        ...incomingHeaders,
        ...tokenHeaders,
      },
      timeout,
      json: body,
    })
    if (error || !result) {
      this.logger.error(error?.stack ?? 'unknown open api error')
      const errorMessage = tryGetMessage(error?.response?.body) || error?.message
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, errorMessage ?? 'unknown error')
    }
    return result.data
  }

  public listLabelTree() {
    return this.request<LabelNode[]>({
      method: 'GET',
      resourceURI: `label/batch`,
      apiVersion: 'v1',
    })
  }

  public deleteIncrementEstimate(ids: string[]) {
    return this.request({
      method: 'DELETE',
      resourceURI: `increment/batch`,
      apiVersion: 'v1',
      body: ids,
    })
  }

  public createIncrementEstimate(body: CreateIncrementEstimateBody) {
    const newIncrements = body?.data
    return this.request({
      method: 'POST',
      resourceURI: `increment/batch`,
      apiVersion: 'v1',
      body: newIncrements,
    })
  }

  public editIncrementEstimate(body: EditIncrementEstimateBody) {
    const { data, ids } = body

    return this.request({
      method: 'PUT',
      resourceURI: `increment/batch`,
      apiVersion: 'v1',
      body: {
        data,
        ids,
      },
    })
  }

  public editStockResource(body: EditStockResourceBody) {
    const { data, sduClusterIds } = body

    return this.request({
      method: 'PUT',
      resourceURI: `stock/batch`,
      apiVersion: 'v1',
      body: {
        data,
        sduClusterIds,
      },
    })
  }

  public listAzs() {
    return this.request<string[]>({
      method: 'GET',
      resourceURI: 'common/az',
      apiVersion: 'v1',
    })
  }

  public listEnvs() {
    return this.request<string[]>({
      method: 'GET',
      resourceURI: 'common/env',
      apiVersion: 'v1',
    })
  }

  public listCids() {
    return this.request<string[]>({
      method: 'GET',
      resourceURI: 'common/cid',
      apiVersion: 'v1',
    })
  }

  public listClusters(az: string) {
    return this.request<string[]>({
      method: 'GET',
      resourceURI: `common/${az}/cluster`,
      apiVersion: 'v1',
    })
  }

  public listSegments(az: string) {
    return this.request<string[]>({
      method: 'GET',
      resourceURI: `common/${az}/segment`,
      apiVersion: 'v1',
    })
  }

  public listMachineModels() {
    return this.request<string[]>({
      method: 'GET',
      resourceURI: 'common/machine-model',
      apiVersion: 'v1',
    })
  }

  public listStockResource(query: ListOpenApiStockQuery) {
    return this.request<OpenApiStock, ListOpenApiStockQuery>({
      method: 'GET',
      resourceURI: `stock/batch`,
      apiVersion: 'v1',
      query,
    })
  }

  public listIncrementResource(query: ListIncrementQuery) {
    return this.request<OpenApiIncrement, ListIncrementQuery>({
      method: 'GET',
      resourceURI: `increment/batch`,
      apiVersion: 'v1',
      query,
    })
  }

  public listVersion() {
    return this.request<Version[]>({
      method: 'GET',
      resourceURI: 'version',
      apiVersion: 'v1',
    })
  }

  public createVersion(data: CreateVersionBody) {
    return this.request({
      method: 'POST',
      resourceURI: `version`,
      apiVersion: 'v1',
      body: data,
    })
  }

  public editVersion(body: EditVersionBody) {
    return this.request({
      method: 'PUT',
      resourceURI: 'version/batch',
      apiVersion: 'v1',
      body,
    })
  }

  public listSummary(query: ListSummaryQuery) {
    return this.request<Summary, ListSummaryQuery>({
      method: 'GET',
      resourceURI: 'summary/batch',
      apiVersion: 'v1',
      query,
    })
  }

  public listBigSales() {
    return this.request<BigSale[]>({
      method: 'GET',
      resourceURI: 'common/big-sale',
      apiVersion: 'v1',
    })
  }
}
