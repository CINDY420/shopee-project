import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/shared/open-api/open-api.service'
import {
  CreateHpaParams,
  CreateHpaBody,
  UpdateHpaParams,
  UpdateHpaBody,
  ListHPARulesParams,
  ListHPARulesQuery,
  BatchEditHPARulesParams,
  BatchEditHPARulesBody,
  GetHpaDetailParams,
  GetHpaDetailQuery,
  BatchCopyHpaParams,
  BatchCopyHpaBody,
  GetHpaDefaultConfigParams,
  GetHpaDefaultConfigQuery,
} from '@/features/hpa/dto/hpa.dto'
import { transformHpaToOpenApi, formatOpenApiHpa, formatOpenApiHpaSpec } from '@/common/helpers/hpa'
@Injectable()
export class HpaService {
  constructor(private readonly openApiService: OpenApiService) {}

  public createHpa(params: CreateHpaParams, body: CreateHpaBody) {
    const { meta, spec } = body
    const transformedHpa = transformHpaToOpenApi({ meta, spec })
    const transformedBody = { hpa: transformedHpa }
    return this.openApiService.createHpa(params, transformedBody)
  }

  public updateHpa(params: UpdateHpaParams, body: UpdateHpaBody) {
    const { meta, spec, id } = body
    const transformedHpa = transformHpaToOpenApi({ id, meta, spec })
    const transformedBody = { hpa: transformedHpa }
    return this.openApiService.updateHpa(params, transformedBody)
  }

  public async listHPARules(params: ListHPARulesParams, query: ListHPARulesQuery) {
    const { lists, total } = await this.openApiService.listHPARules(params, query)
    const formattedHpaList = lists.map((hpa) => formatOpenApiHpa(hpa))
    return { lists: formattedHpaList, total }
  }

  public batchEnableHPARules(params: BatchEditHPARulesParams, body: BatchEditHPARulesBody) {
    const { hpas = [] } = body || {}
    const transformedHpas = hpas.map(transformHpaToOpenApi)
    const transformedBody = { hpas: transformedHpas }
    return this.openApiService.batchEnableHPARules(params, transformedBody)
  }

  public batchDisableHPARules(params: BatchEditHPARulesParams, body: BatchEditHPARulesBody) {
    const { hpas = [] } = body || {}
    const transformedHpas = hpas.map(transformHpaToOpenApi)
    const transformedBody = { hpas: transformedHpas }
    return this.openApiService.batchDisableHPARules(params, transformedBody)
  }

  public batchDeleteHPARules(params: BatchEditHPARulesParams, body: BatchEditHPARulesBody) {
    const { hpas = [] } = body || {}
    const transformedHpas = hpas.map(transformHpaToOpenApi)
    const transformedBody = { hpas: transformedHpas }
    return this.openApiService.batchDeleteHPARules(params, transformedBody)
  }

  public async getHpaDetail(params: GetHpaDetailParams, query: GetHpaDetailQuery) {
    const openApiHpaDetail = await this.openApiService.getHpaDetail(params, query)
    const formattedHpaDetail = formatOpenApiHpa(openApiHpaDetail)
    return formattedHpaDetail
  }

  public async batchCopyHpa(params: BatchCopyHpaParams, body: BatchCopyHpaBody) {
    const { deploymentsHpas } = body
    const { lists: allDeploymentsHpaRules } = await this.openApiService.listHPARules(params, {})

    const deploymentsHpasWithIdRules = deploymentsHpas.map((deploymentHpa) => {
      const id = allDeploymentsHpaRules.find(
        (item) => item.meta.az === deploymentHpa.meta.az && item.meta.sdu === deploymentHpa.meta.sdu,
      )?.id
      const deploymentHpaWithId = { ...deploymentHpa, id }
      return deploymentHpaWithId
    })

    return Promise.all(
      deploymentsHpasWithIdRules.map((item) => {
        const { meta, spec, id } = item
        if (id !== undefined) {
          const transformedHpa = transformHpaToOpenApi({ id, meta, spec })
          const transformedBody = { hpa: transformedHpa }
          return this.openApiService.updateHpa(params, transformedBody).catch((error) => ({
            azSdu: item.meta,
            errorMessage: error.message,
          }))
        } else {
          const transformedHpa = transformHpaToOpenApi({ meta, spec })
          const transformedBody = { hpa: transformedHpa }
          return this.openApiService.createHpa(params, transformedBody).catch((error) => ({
            azSdu: item.meta,
            errorMessage: error.message,
          }))
        }
      }),
    )
  }

  public async getHpaDefaultConfig(params: GetHpaDefaultConfigParams, query: GetHpaDefaultConfigQuery) {
    const openApiHpaDefaultConfig = await this.openApiService.getHpaDefaultConfig(params, query)
    const formattedHpaDetail = formatOpenApiHpaSpec(openApiHpaDefaultConfig)
    return formattedHpaDetail
  }
}
