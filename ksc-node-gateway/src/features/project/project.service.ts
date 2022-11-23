import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import {
  ListProjectsQuery,
  ListProjectsResponse,
  GetProjectResponse,
  EnvClusterMetric,
  ClusterMetric,
} from '@/features/project/dto/project.dto'
import { convertK8sMemoryQuotaToNumber } from '@/common/utils/quota'
import { MEMORY_UNIT } from '@/common/constants/quota'
import { transformFrontendListQueryToOpenApiListQuery } from '@/common/utils/query'

@Injectable()
export class ProjectService {
  constructor(private readonly openApiService: OpenApiService) {}
  async listProjects(tenantId: string, listProjectsQuery: ListProjectsQuery): Promise<ListProjectsResponse> {
    const openApiListProjectsQuery = transformFrontendListQueryToOpenApiListQuery(listProjectsQuery)
    const { offset, limit, filterBy, sortBy, keyword } = openApiListProjectsQuery
    const openApiProjects = await this.openApiService.listProjects(tenantId, {
      offset,
      limit,
      filterBy,
      sortBy,
      keyword,
    })
    const { total, items } = openApiProjects
    // Extract envs and clusters from project quota one by one
    const projectList = await Promise.all(
      items.map(async (project) => {
        const { tenantId, projectId, displayName } = project
        const projectDetail = await this.openApiService.getProject(tenantId, projectId)
        const { envQuotas } = projectDetail
        // Extract envs and clusters from project quota without repetition
        const envMap: Record<string, boolean> = {}
        const clusterMap: Record<string, boolean> = {}
        envQuotas.forEach((envQuota) => {
          const { env, clusterQuota: clusterQuotas } = envQuota
          if (env) {
            envMap[env] = true
          }
          clusterQuotas.forEach((clusterQuota) => {
            const { clusterName } = clusterQuota
            if (clusterName) {
              clusterMap[clusterName] = true
            }
          })
        })
        return { tenantId, projectId, displayName, envs: Object.keys(envMap), clusters: Object.keys(clusterMap) }
      }),
    )

    return { total, items: projectList }
  }

  async getProject(tenantId: string, projectId: string): Promise<GetProjectResponse> {
    const openApiProject = await this.openApiService.getProject(tenantId, projectId)
    const {
      tenantId: responseTenantId,
      projectId: responseProjectId,
      displayName,
      envQuotas,
      uss,
      logStore,
    } = openApiProject
    const envClusterMetrics: EnvClusterMetric[] = envQuotas.map((envQuota) => {
      const { env, clusterQuota: clusterQuotas } = envQuota
      const clusterMetrics: ClusterMetric[] = clusterQuotas.map((clusterQuota) => {
        const { clusterId, clusterName, quota } = clusterQuota
        const { cpu: quotaCpu, gpu: quotaGpu, memory: quotaMemory } = quota
        const quotaMemoryNumber = convertK8sMemoryQuotaToNumber(quotaMemory, MEMORY_UNIT.GI)
        return {
          clusterId,
          clusterName,
          used: { cpu: 0, gpu: 0, memory: 0 }, // TODO huadong.chen add used metric after openapi supports
          assigned: { cpu: 0, gpu: 0, memory: 0 }, // TODO huadong.chen add assigned metric after openapi supports
          quota: { cpu: quotaCpu, gpu: quotaGpu, memory: quotaMemoryNumber },
        }
      })
      return { env, clusterMetrics }
    })
    return {
      tenantId: responseTenantId,
      projectId: responseProjectId,
      displayName,
      envClusterMetrics,
      uss,
      logStore,
    }
  }
}
