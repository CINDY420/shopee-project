import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ListDeploymentsParam {
  @IsString()
  @IsNotEmpty()
  sduName: string
}

export class ListDeploymentsQuery {
  @IsOptional()
  withDetail?: boolean
}

export class ListDeploymentsResponse {
  items: ServiceDeployment[]
  total: number
}

export class ServiceDeployment {
  deployId: string
  sduName: string
  project: string
  module: string
  env: string
  cid: string
  feature: string
  bundle: string
  azV1: string
  azV2: string
  cluster: string
  clusterType: string
  deployEngine: string
  componentType: string
  summary: ServiceDeploymentSummary
  status: ServiceDeploymentStatus
}

export class ServiceDeploymentSummary {
  cpu: number
  mem: number
  disk: number
  healthyInstances: number
  killingInstances: number
  runningInstances: number
  stagingInstances: number
  startingInstances: number
  targetInstances: number
  unhealthyInstances: number
  unknownInstances: number
  releaseInstances: number
  canaryInstances: number
  state: string
  lastDeployed: number
}

export class ServiceDeploymentStatus {
  reason: string
  orchestrator: string
  containers: ServiceDeploymentContainer[]
}

export class ServiceDeploymentContainer {
  name: string
  image: string
  phase: string
  tag: string
}
