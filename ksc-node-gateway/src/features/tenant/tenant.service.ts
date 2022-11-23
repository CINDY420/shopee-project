import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'

import {
  ListTenantsQuery,
  ListTenantsResponse,
  TenantListItem,
  UpdateTenantsPayload,
  UpdateTenantsResponse,
} from '@/features/tenant/dto/tenant.dto'

import { MEMORY_UNIT } from '@/common/constants/quota'
import { convertK8sMemoryQuotaToNumber } from '@/common/utils/quota'
import { transformFrontendListQueryToOpenApiListQuery } from '@/common/utils/query'

enum ALL_SETTLED_STATUS {
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}
function isPromiseFulfilledResult<TValue>(item: PromiseSettledResult<TValue>): item is PromiseFulfilledResult<TValue> {
  return item.status === ALL_SETTLED_STATUS.FULFILLED
}

@Injectable()
export class TenantService {
  constructor(private readonly openApiService: OpenApiService) {}

  public async listTenants(listTenantsQuery: ListTenantsQuery): Promise<ListTenantsResponse> {
    const openApiListTenantsQuery = transformFrontendListQueryToOpenApiListQuery(listTenantsQuery)
    const { offset, limit, filterBy, sortBy, keyword } = openApiListTenantsQuery
    const openApiTenantList = await this.openApiService.listTenants({ offset, limit, filterBy, sortBy, keyword })
    const tenantItems: TenantListItem[] = openApiTenantList.items.map((tenant) => {
      const { productlineId, productlineName, envQuotas, ...others } = tenant

      const quota = { cpu: 0, gpu: 0, memory: 0 }
      envQuotas.forEach((envQuota) => {
        const { clusterQuota: clusterQuotaList = [] } = envQuota || {}
        clusterQuotaList.forEach((clusterQuotaItem) => {
          const { cpu = 0, gpu = 0, memory = '0Gi' } = clusterQuotaItem?.quota || {}
          quota.cpu += cpu
          quota.gpu += gpu
          quota.memory += convertK8sMemoryQuotaToNumber(memory, MEMORY_UNIT.GI)
        })
      })

      return {
        productLineId: productlineId,
        productLineName: productlineName,
        quota,
        ...others,
      }
    })
    return { total: openApiTenantList.total, items: tenantItems }
  }

  public async updateTenants(updateTenantsPayload: UpdateTenantsPayload): Promise<UpdateTenantsResponse> {
    const tenantNames: string[] = []
    const updateResults = await Promise.allSettled(
      Object.keys(updateTenantsPayload).map(async (tenantId) => {
        const { envQuotas, tenantCmdbName } = updateTenantsPayload[tenantId]
        tenantNames.push(tenantCmdbName)
        return await this.openApiService.updateTenant(tenantId, {
          tenantCmdbName,
          envQuotas,
        })
      }),
    )
    const successTenantNames = updateResults
      .map((item) => {
        if (isPromiseFulfilledResult(item)) {
          return item.value.displayName
        }
        return ''
      })
      .filter((item) => item !== '')
    const failedTenantNames = tenantNames.filter((name) => successTenantNames.indexOf(name) === -1)
    return {
      successed: successTenantNames,
      failed: failedTenantNames,
    }
  }
}
