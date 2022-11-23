import { IsNotEmpty, IsString } from 'class-validator'
import { ListQuery } from '@/common/dtos/list.dto'

export class ListPodsQuery extends ListQuery {}
export class ListPodsParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectId: string

  @IsNotEmpty()
  @IsString()
  jobId: string
}

export class ListPodContainersParams {
  tenantId: string
  projectId: string
  jobId: string
  podName: string
}

export class GetPodTerminalSessionId {
  clusterId: string
  namespace: string
  podName: string
  containerName: string
}
