import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

// Param
export class ListSduParam {
  @IsString()
  @IsNotEmpty()
  serviceName: string
}
// Query
export class ListSduQuery {
  @IsString()
  @IsOptional()
  searchBy?: string

  @IsString()
  @IsOptional()
  filterBy?: string

  @IsString()
  @IsOptional()
  sduFilterBy?: string

  @IsString()
  @IsOptional()
  orderBy?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number

  @IsOptional()
  isGroup?: boolean
}
// Response
export class ListSduResponse {
  items: SduList[]
  total: number
  totalOfInstances: number
}

export class SduList {
  sduId: number
  serviceId: number
  sdu: string
  resourceType: string
  env: string
  cid: string
  idcs: unknown[]
  version: string
  deploymentLink: string
  serviceName: string
  identifier: Identifier
  summary: Summary
  deployments: Deployment[]
}

export class Deployment {
  deployId: string
  sduName: string
  azV1: string
  deployEngine: string
  cluster: string
  monitoringClusterName?: string
  componentType: string
  status: DeploymentStatus
  summary: DeploymentSummary
}
class DeploymentStatus {
  containers: Container[]
  orchestrator: string
  reason: string
}

class DeploymentSummary {
  targetInstances: number
  unhealthyInstances: number
  unknownInstances: number
  state: string
  disk: number
  cpu: number
  mem: number
  lastDeployed: number
}

export class Container {
  phase: string
  name: string
  image: string
  tag: string
  timestamp: string
}
export class Identifier {
  module: string
  project: string
}
export class Summary {
  cpu: number
  mem: number
  disk: number
  lastDeployed: number
  state: string
  targetInstances: number
  unhealthyInstances: number
}
