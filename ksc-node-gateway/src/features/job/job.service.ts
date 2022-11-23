import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { GetJobResponse, JobResponseTaskContainer } from '@/features/job/dto/job.dto'
import { OpenApiJobResponseTaskContainer } from '@/common/dtos/openApi/job.dto'

import { MEMORY_UNIT } from '@/common/constants/quota'
import { convertK8sMemoryQuotaToNumber } from '@/common/utils/quota'

@Injectable()
export class JobService {
  constructor(private readonly openApiService: OpenApiService) {}

  public async getJob(tenantId: string, projectId: string, jobId: string): Promise<GetJobResponse> {
    const openApiJobDetail = await this.openApiService.getJob(tenantId, projectId, jobId)
    const { tasks, ...others } = openApiJobDetail

    const formatTasks = tasks.map((task) => {
      const { initContainers, containers, ...others } = task
      const formatInitContainers = initContainers.map((container) => this.formatContainerQuota(container))
      const formatContainers = containers.map((container) => this.formatContainerQuota(container))
      return { initContainers: formatInitContainers, containers: formatContainers, ...others }
    })
    return { tasks: formatTasks, ...others }
  }

  private formatContainerQuota(container: OpenApiJobResponseTaskContainer): JobResponseTaskContainer {
    const { resource, ...others } = container
    const { limits, requests } = resource
    const { cpu: cpuLimit, gpu: gpuLimit, memory: memoryLimit } = limits ?? {}
    const { cpu: cpuRequest, gpu: gpuRequest, memory: memoryRequest } = requests ?? {}
    const formatResource = {
      limits: {
        cpu: cpuLimit,
        gpu: gpuLimit,
        memory: memoryLimit ? convertK8sMemoryQuotaToNumber(memoryLimit, MEMORY_UNIT.GI) : 0,
      },
      requests: {
        cpu: cpuRequest,
        gpu: gpuRequest,
        memory: convertK8sMemoryQuotaToNumber(memoryRequest, MEMORY_UNIT.GI),
      },
    }
    return { resource: formatResource, ...others }
  }
}
