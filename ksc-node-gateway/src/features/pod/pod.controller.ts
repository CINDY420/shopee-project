import { Controller, HttpStatus, Param, Query, Get } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { ListPodsResponse } from '@/common/dtos/openApi/pod.dto'
import {
  ListPodsQuery,
  ListPodsParams,
  ListPodContainersParams,
  GetPodTerminalSessionId,
} from '@/features/pod/dto/pod.dto'
import { transformFrontendListQueryToOpenApiListQuery } from '@/common/utils/query'

@ApiTags('Pod')
@Controller('')
export class PodController {
  constructor(private readonly openApiService: OpenApiService) {}

  @Get('tenants/:tenantId/projects/:projectId/jobs/:jobId/pods')
  @ApiResponse({ status: HttpStatus.OK, type: ListPodsResponse, description: 'List pods' })
  listPods(@Param() listPodsParams: ListPodsParams, @Query() listPodsQuery: ListPodsQuery) {
    const { tenantId, projectId, jobId } = listPodsParams
    const openApiListPodsQuery = transformFrontendListQueryToOpenApiListQuery(listPodsQuery)
    const { offset, limit, filterBy, sortBy, keyword } = openApiListPodsQuery
    return this.openApiService.listPods(tenantId, projectId, jobId, { offset, limit, filterBy, sortBy, keyword })
  }

  @Get('tenants/:tenantId/projects/:projectId/jobs/:jobId/pods/:podName/containers')
  listPodContainers(@Param() listPodContainersParams: ListPodContainersParams) {
    const { tenantId, projectId, jobId, podName } = listPodContainersParams
    return this.openApiService.listPodContainers(tenantId, projectId, jobId, podName)
  }

  @Get('clusters/:clusterId/:namespace/:podName/:containerName/shell')
  getPodTerminalSessionId(@Param() getPodTerminalSessionId: GetPodTerminalSessionId) {
    const { clusterId, namespace, podName, containerName } = getPodTerminalSessionId
    return this.openApiService.getPodTerminalSessionId(clusterId, namespace, podName, containerName)
  }
}
