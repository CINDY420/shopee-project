import { IsNotEmpty, IsString } from 'class-validator'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
import { DEPLOYMENT_HEALTHY } from '@/shared/open-api/interfaces/sdu'
import { Az, Container } from '@/features/deployment/entities/deployment.entity'
export class ListTasksParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectName: string

  @IsNotEmpty()
  @IsString()
  appName: string

  @IsNotEmpty()
  @IsString()
  sduName: string
}

export class ListTasksQuery extends ListQuery {}

class Usage {
  used: number
  applied: number
  ready: boolean
  alarm: string
  total: number
}

class Task {
  id: string
  address: string
  host: string
  containerId: string
  deploymentId: string
  status: string
  health: string
  cpu: Usage
  memory: Usage
  createTime: string
}
export class ListTasksResponse {
  totalCount: number
  items: Task[]
  statusList: string[]
}

export class ListDeploymentHistoryParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectName: string

  @IsNotEmpty()
  @IsString()
  appName: string

  @IsNotEmpty()
  @IsString()
  sduName: string
}

export class ListDeploymentHistoryQuery extends ListQuery {}

class DeploymentHistory {
  deploymentId: string
  phase: string
  tag: string
  healthyInstances: number
  unhealthyInstances: number
  instances: number
  cpu: number
  disk: number
  memory: number
  status: string
  updateTime: string
  healthy: DEPLOYMENT_HEALTHY
  pendingReason: string
}

export class ListDeploymentHistoryResponse {
  totalCount: number
  items: DeploymentHistory[]
  statusList: string[]
}

export class GetDeploymentParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectName: string

  @IsNotEmpty()
  @IsString()
  appName: string

  @IsNotEmpty()
  @IsString()
  deploymentName: string
}

export class GetDeploymentQuery {
  @IsNotEmpty()
  @IsString()
  clusterName: string

  @IsNotEmpty()
  @IsString()
  cid: string

  @IsNotEmpty()
  @IsString()
  env: string

  @IsNotEmpty()
  @IsString()
  phase: string
}

export class GetDeploymentResponse {
  name: string
  podCount: number
  abnormalPodCount: number
  runningPodCount: number
  releaseCount: number
  canaryCount: number
  clusterId: string
  clusterName: string
  phase: string
  status: string
  updateTime: Date
  scalable: boolean
  rollbackable: boolean
  fullreleaseable: boolean
  restartable: boolean
  appInstanceName: string
  monitoringClusterName: string
  componentType: string
  componentTypeDisplay: string
  containers: Container[]
  az: Az
  zoneName: string
}
