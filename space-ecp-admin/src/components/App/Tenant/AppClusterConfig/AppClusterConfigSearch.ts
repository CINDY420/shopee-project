import { omit, uniqBy } from 'lodash'
import { fetch } from 'src/rapper'
import { FilterByBuilder } from 'src/helpers/filterByBuilder'

export interface IAppClusterConfigSearchForm {
  tenant: string
  project?: string
  application?: string
  cid?: string
  env?: string
  azSegment?: string
}

export interface IAppClusterConfigSearchOptions {
  tenant: string
  project?: string
  application?: string
  cid?: string
  env?: string
  // eslint-disable-next-line @typescript-eslint/naming-convention
  az_key?: string
  // eslint-disable-next-line @typescript-eslint/naming-convention
  segment_key?: string
}

export const SCOPES = {
  SDU: 'sdu',
  APPLICATION: 'application',
  PROJECT: 'project',
  TENANT: 'cmdb_tenant_id',
} as const
export type AppClusterConfigSearchScope = typeof SCOPES[keyof typeof SCOPES]

export const scopeMap: Record<string, AppClusterConfigSearchScope | undefined> = {
  tenant: SCOPES.TENANT,
  project: SCOPES.PROJECT,
  application: SCOPES.APPLICATION,
  'application-CID': SCOPES.SDU,
}

/**
 * An encapsulation of rapper fetch API ('GET/ecpadmin/appClusterConfigs') to search app cluster configs.
 */
export class AppClusterConfigSearch {
  private readonly form
  private readonly options: IAppClusterConfigSearchOptions
  private readonly isCMDB

  /**
   * construct a search instance
   * @param form - search form
   * @param isCMDB - whether the search is for CMDB (the "Default Configs" tab)
   */
  constructor(form: IAppClusterConfigSearchForm, isCMDB = false) {
    this.form = form
    this.isCMDB = isCMDB
    this.options = {
      tenant: form.tenant,
      project: form.project,
      application: form.application,
      cid: form.cid,
      env: form.env,
    }
    const { azSegment } = form
    if (azSegment) {
      const [azKey, segmentKey] = azSegment.split('-')
      this.options.az_key = azKey
      this.options.segment_key = segmentKey
    }
  }

  /**
   * calculate the scope of the search
   * @private
   */
  private getScope() {
    if (this.options.cid) {
      return SCOPES.SDU
    }
    if (this.options.application) {
      return SCOPES.APPLICATION
    }
    if (this.options.project) {
      return SCOPES.PROJECT
    }
    return SCOPES.TENANT
  }

  /**
   * get the key of the search for constructing part of the filterBy
   * @param scope
   * @private
   */
  private getKey(scope: AppClusterConfigSearchScope = this.getScope()) {
    switch (scope) {
      case SCOPES.SDU:
        return `${this.options.application}-${this.options.env}-${this.options.cid}`
      case SCOPES.APPLICATION:
        return this.options.application ?? ''
      case SCOPES.PROJECT:
        return this.options.project ?? ''
      case SCOPES.TENANT:
        return this.options.tenant
      default:
        const _neverScope: never = scope
        return ''
    }
  }

  /**
   * get the filterBys for the search, one filterBy for one scope, every filterBy will be use to send a search request
   * @private
   */
  private getFilterBys(scope: AppClusterConfigSearchScope = this.getScope()) {
    const otherOptions = omit(this.options, ['tenant', 'project', 'application', 'cid'])

    const tenantFilterBy = new FilterByBuilder()
      .appendAndEq(otherOptions)
      .appendAndEq('key', this.getKey(SCOPES.TENANT))
      .appendAndEq('scope', SCOPES.TENANT)

    const projectFilterBy = new FilterByBuilder()
      .appendAndEq(otherOptions)
      .appendAndEq('key', this.getKey(SCOPES.PROJECT))
      .appendAndEq('scope', SCOPES.PROJECT)

    const applicationFilterBy = new FilterByBuilder()
      .appendAndEq(otherOptions)
      .appendAndEq('key', this.getKey(SCOPES.APPLICATION))
      .appendAndEq('scope', SCOPES.APPLICATION)

    const sduFilterBy = new FilterByBuilder()
      .appendAndEq(otherOptions)
      .appendAndEq('key', this.getKey(SCOPES.SDU))
      .appendAndEq('scope', SCOPES.SDU)

    const filterByBuilders = [tenantFilterBy]

    switch (scope) {
      case SCOPES.PROJECT:
        filterByBuilders.push(projectFilterBy)
        break
      case SCOPES.APPLICATION:
        filterByBuilders.push(projectFilterBy)
        filterByBuilders.push(applicationFilterBy)
        break
      case SCOPES.SDU:
        filterByBuilders.push(projectFilterBy)
        filterByBuilders.push(applicationFilterBy)
        filterByBuilders.push(sduFilterBy)
        break
      case SCOPES.TENANT:
        break
      default:
        const _neverScope: never = scope
        return []
    }

    return filterByBuilders.map((filterByBuilder) => filterByBuilder.build())
  }

  /**
   * get the search result for all the scopes
   * @private
   */
  private getSearchResult() {
    const filterBys = this.getFilterBys()
    return Promise.all(
      filterBys.map((filterBy) =>
        fetch['GET/ecpadmin/appClusterConfigs']({
          filterBy,
          pageNum: '1',
          pageSize: '9999999',
          cmdbTenantId: this.isCMDB ? this.options.tenant : undefined,
        }),
      ),
    )
  }

  /**
   * handle the search result, process the result for showing in the "Search" tab
   */
  async getClusters() {
    const results = await this.getSearchResult()
    const clusterMaps = results.map((result) => {
      const { items } = result
      return items.map((item) => ({
        name: item.clusterName ?? '',
        id: item.clusterUuid ?? '',
      }))
    })
    const [tenantClusters = [], projectClusters = [], applicationClusters = [], sduClusters = []] =
      clusterMaps
    return [
      {
        scope: SCOPES.SDU.toUpperCase(),
        clusters: uniqBy(sduClusters, (sduCluster) => sduCluster.id),
      },
      {
        scope: SCOPES.APPLICATION.toUpperCase(),
        clusters: uniqBy(applicationClusters, (applicationCluster) => applicationCluster.id),
      },
      {
        scope: SCOPES.PROJECT.toUpperCase(),
        clusters: uniqBy(projectClusters, (projectCluster) => projectCluster.id),
      },
      {
        scope: 'TENANT',
        clusters: uniqBy(tenantClusters, (tenantCluster) => tenantCluster.id),
      },
    ]
  }

  async getConfigs(fontEndScope: string, tenant: string, env: string, ignoreKey = false) {
    const scope = scopeMap[fontEndScope]
    if (!scope) {
      return {
        raw: [],
        aggregated: [],
        list: [],
      }
    }
    const options: Record<string, string | undefined> = {
      env: this.options.env,
      key: this.getKey(scope),
      scope,
    }
    // for sdu default config list, we need to ignore the key
    if (ignoreKey) {
      options.key = undefined
    }
    const filterBy = new FilterByBuilder().appendAndEq(options).build()
    const result = await fetch['GET/ecpadmin/appClusterConfigs']({
      filterBy,
      pageNum: '1',
      pageSize: '9999999',
      cmdbTenantId: this.isCMDB ? this.options.tenant : undefined,
    })

    // Aggregate azSegment and cluster
    const map = new Map<string, typeof result.items>()
    result.items.forEach((item) => {
      const { azKey, segmentKey, clusterUuid } = item
      const key = `${azKey}-${segmentKey}-${clusterUuid}`
      if (!map.has(key)) {
        map.set(key, [item])
      } else {
        map.set(key, [...(map.get(key) ?? []), item])
      }
    })

    const aggregated = Array.from(map.entries()).map(([key, items]) => {
      const [azKey, segmentKey, ...clusterUuids] = key.split('-')
      return {
        azKey,
        segmentKey,
        clusterUuid: clusterUuids.join('-'),
        items,
        azSegment: `${items[0].az?.name ?? ''}${
          items[0].segment?.name ? `-${items[0].segment?.name}` : ''
        }`,
        cluster: items[0].clusterName ?? '',
        scope: items[0].scope,
        keys: items.map((item) => item.key),
      }
    })

    const listed = result.items.map((item) => ({
      id: item.id,
      env,
      azKey: item.azKey ?? '',
      segmentKey: item.segmentKey ?? '',
      clusterUuid: item.clusterUuid ?? '',
      key: item.key ?? '',
      scope: item.scope ?? '',
      cmdbTenantId: tenant,
    }))

    return {
      raw: result.items,
      aggregated,
      listed,
    }
  }
}
