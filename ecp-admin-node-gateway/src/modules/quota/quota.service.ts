import { Injectable } from '@nestjs/common'
import {
  GetSegmentQuotaParams,
  GetSegmentQuotaQuery,
  GetSegmentQuotaResponse,
  ListTenantsQuotaParams,
  ListTenantsQuotaQuery,
  ListTenantsQuotaResponse,
  SwitchQuotaBody,
  SwitchQuotaParam,
  UpdateSegmentQuotaBody,
  UpdateSegmentQuotaParams,
  UpdateTenantsQuotaBody,
  ListTenantsQuotaItem,
} from '@/modules/quota/dto/quota.dto'
import { EcpAdminApisService } from '@/shared/ecp-admin-apis/ecp-admin-apis.service'
import { SpaceCMDBService } from '@/shared/space-cmdb/space-cmdb.service'
import { listQuery } from '@infra/utils'
import { ENV } from '@/constants/quota'

const { FilterByParser, FilterByOperator } = listQuery

@Injectable()
export class QuotaService {
  constructor(
    private readonly ecpAdminApisService: EcpAdminApisService,
    private readonly spaceCmdbService: SpaceCMDBService,
  ) {}

  async listTenantsQuota(
    param: ListTenantsQuotaParams,
    query: ListTenantsQuotaQuery,
  ): Promise<ListTenantsQuotaResponse> {
    const { filterBy = '', searchBy } = query
    const { azKey, segmentKey } = param
    const allTenantsQuota = await this.ecpAdminApisService
      .getApis()
      .getTenantQuotaByKeys({ az: azKey, segment: segmentKey })

    const allTenants = await this.spaceCmdbService.tryFetch('GET/apis/cmdb/v2/service/tenant/get')

    // search
    const searchedTenants = allTenants.tenants.filter((item) =>
      new RegExp(`.*${searchBy}.*`).test(item.tenant_name),
    )

    // sort tenant name
    const sortedSearchTenants = searchedTenants.sort((previous, current) =>
      previous.tenant_name < current.tenant_name ? -1 : 1,
    )

    // filter env
    const filterByParser = new FilterByParser(filterBy)
    const envFilterByItems = filterByParser.parseByKeyPath('env')
    const searchedEnvs = envFilterByItems[FilterByOperator.CONTAINS] ?? []
    const filteredEnvs = Object.values(ENV).filter((env) => searchedEnvs.includes(env))

    // find empty and nonEmpty quota
    const nonEmptyTenantQuotaList: ListTenantsQuotaItem[] = []
    const emptyTenantQuotaList: ListTenantsQuotaItem[] = []

    sortedSearchTenants.forEach(({ tenant_id: tenantId, tenant_name: tenantName }) => {
      const currentTenantEnvsQuota = allTenantsQuota.quotas?.filter(
        (tenantEnvQuota) => tenantEnvQuota.tenantId === String(tenantId),
      )
      let emptyQuota = true
      const envQuotaList = filteredEnvs.map((env, index) => {
        const currentEnvQuota = currentTenantEnvsQuota?.find((item) => item.env === env)

        if (currentEnvQuota) {
          emptyQuota = false
        }

        const cpuApplied = currentEnvQuota?.cpuApplied ?? 0
        const cpuQuota = currentEnvQuota?.cpuQuota ?? 0
        const memoryApplied = currentEnvQuota?.memoryApplied ?? 0
        const memoryQuota = currentEnvQuota?.memoryQuota ?? 0

        // init all filtered envs quota with 0 if not exist
        return {
          tenantName,
          tenantId: String(tenantId),
          env,
          cpuApplied: Number(cpuApplied),
          cpuQuota: Number(cpuQuota),
          memoryApplied: Number(memoryApplied),
          memoryQuota: Number(memoryQuota),
          az: currentEnvQuota?.az ?? '',
          segment: currentEnvQuota?.segment ?? '',
          colSpan: index === 0 ? filteredEnvs.length : 0,
        }
      })
      if (emptyQuota) {
        emptyTenantQuotaList.push(...envQuotaList)
      } else {
        nonEmptyTenantQuotaList.push(...envQuotaList)
      }
    })
    // sort: by quota not empty and then tenantName and then env
    const sortedNonEmptyTenantQuotaList = nonEmptyTenantQuotaList.sort((previous, current) =>
      previous.tenantName < current.tenantName ? -1 : 1,
    )
    const sortedEmptyTenantQuotaList = emptyTenantQuotaList.sort((previous, current) =>
      previous.tenantName < current.tenantName ? -1 : 1,
    )
    const allSortedTenantQuotaList = [
      ...sortedNonEmptyTenantQuotaList,
      ...sortedEmptyTenantQuotaList,
    ]

    return { items: allSortedTenantQuotaList, total: allSortedTenantQuotaList.length }
  }

  async listTenantsQuotableEnvs(param: ListTenantsQuotaParams) {
    const { azKey, segmentKey } = param
    const allTenantsQuota = await this.ecpAdminApisService
      .getApis()
      .getTenantQuotaByKeys({ az: azKey, segment: segmentKey })

    const envQuotableMap: Record<string, boolean> = {
      [ENV.LIVE]: false,
      [ENV.LIVEISH]: false,
      [ENV.STABLE]: false,
      [ENV.STAGING]: false,
      [ENV.TEST]: false,
      [ENV.UAT]: false,
    }

    allTenantsQuota.quotas?.forEach(({ cpuQuota = 0, memoryQuota = 0, env = '' }) => {
      if (cpuQuota !== 0 || memoryQuota !== 0) {
        envQuotableMap[env] = true
      }
    })

    const quotableEnvs = Object.entries(envQuotableMap)
      .filter(([_, quotable]) => quotable)
      .map(([env]) => env)
    return { quotableEnvs }
  }

  updateTenantsQuota(param: ListTenantsQuotaParams, body: UpdateTenantsQuotaBody) {
    const { azKey, segmentKey } = param
    const formattedTenantsQuota = body.items.map(({ cpuQuota, memoryQuota, ...others }) => ({
      az: azKey,
      segment: segmentKey,
      cpu: cpuQuota.toString(),
      memory: memoryQuota.toString(),
      ...others,
    }))
    return this.ecpAdminApisService.getApis().updateTenantsQuota({ quotas: formattedTenantsQuota })
  }

  async getSegmentQuota(
    param: GetSegmentQuotaParams,
    query: GetSegmentQuotaQuery,
  ): Promise<GetSegmentQuotaResponse> {
    const res = await this.ecpAdminApisService.getApis().getSegmentQuota({
      az: param.azKey,
      segment: param.segmentKey,
      ...query,
    })
    return {
      az: res?.az ?? '',
      segment: res?.segment ?? '',
      env: res?.env ?? '',
      cpuApplied: Number(res?.cpuApplied),
      cpuAssigned: Number(res?.cpuAssigned),
      cpuTotal: Number(res?.cpuTotal),
      memoryApplied: Number(res?.memoryApplied),
      memoryAssigned: Number(res?.memoryAssigned),
      memoryTotal: Number(res?.memoryTotal),
      enabledQuota: res?.needCheck ?? false,
    }
  }

  updateSegmentQuota(param: UpdateSegmentQuotaParams, body: UpdateSegmentQuotaBody) {
    return this.ecpAdminApisService.getApis().updateSegmentQuota({
      az: param.azKey,
      segment: param.segmentKey,
      env: body.env,
      reason: body.reason,
      cpu: body.addCPU.toString(),
      memory: body.addMemory.toString(),
    })
  }

  switchSegmentEnvQuota(param: SwitchQuotaParam, body: SwitchQuotaBody) {
    return this.ecpAdminApisService.getApis().updateTenantQuotaSwitch({
      az: param.azKey,
      segment: param.segmentKey,
      env: param.env,
      ...body,
    })
  }
}
