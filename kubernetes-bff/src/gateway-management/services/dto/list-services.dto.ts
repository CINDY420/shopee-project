import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { IClusterStatus } from 'common/constants'
import { V1Service } from '@kubernetes/client-node'
import { IsStringOrNull, IsIntOrNull } from 'common/decorators/validations/common'

export class GetServiceListParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  project: string
}

export class ListQueryDto {
  @ApiPropertyOptional()
  @IsIntOrNull({ message: 'offset should be number or null' })
  offset: number

  @ApiPropertyOptional()
  @IsIntOrNull({ message: 'limit should be number or null' })
  limit: number

  @ApiPropertyOptional()
  @IsStringOrNull({ message: 'orderBy should be string or null' })
  orderBy: string

  @ApiPropertyOptional()
  @IsStringOrNull({ message: 'filterBy should be string or null' })
  filterBy: string
}

interface IProjectInfo {
  group: string
  cids: string[]
  clusters: string[]
  relations: string[]
  createtime: string
  environments: string[]
  project: string
  updatetime: string
}

export interface IProjectDetail {
  id: string
  info: IProjectInfo
}

class ClusterInfoHealthySummary {
  @ApiProperty()
  count: number

  @ApiProperty()
  unhealthyCount: number
}

class ClusterInfoMetrics {
  @ApiProperty()
  capacity: number

  @ApiProperty()
  reserved: number

  @ApiProperty()
  assigned: number

  @ApiProperty()
  free: number

  @ApiProperty()
  used: number

  @ApiProperty()
  assignedUsage: number

  @ApiProperty()
  usedUsage: number
}

class ClusterInfoAlarm {
  @ApiProperty()
  type: string

  @ApiProperty()
  resourceName: string

  @ApiProperty()
  detail: {
    [key: string]: string
  }
}

class ClusterInfoConfig {
  @ApiProperty()
  name: string

  @ApiProperty()
  kubeconfig: string
}

class Metrics {
  @ApiProperty({ type: ClusterInfoMetrics })
  cpu: ClusterInfoMetrics

  @ApiProperty({ type: ClusterInfoMetrics })
  memory: ClusterInfoMetrics
}

export class ClusterInfoDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  creationTimestamp: string

  @ApiProperty({ type: ClusterInfoConfig })
  config: ClusterInfoConfig

  @ApiProperty({ enum: ['Healthy', 'Unhealthy', 'Unknown'] })
  status: IClusterStatus

  @ApiProperty({ type: [ClusterInfoAlarm] })
  alarms: ClusterInfoAlarm[]

  @ApiProperty({ type: ClusterInfoHealthySummary })
  nodeSummary: ClusterInfoHealthySummary

  @ApiProperty({ type: ClusterInfoHealthySummary })
  podSummary: ClusterInfoHealthySummary

  @ApiProperty({ type: Metrics })
  metrics: Metrics

  @ApiProperty({ type: [String] })
  envs: string[]

  @ApiProperty({ type: [String] })
  cids: string[]

  @ApiProperty({ type: [String] })
  groups: string[]
}

interface IAgentServiceItemMetadataLabels {
  cid: string
  env: string
  group: string
  platform: string
  project: string
}

interface IAgentServiceItemMetadata {
  name: string
  namespace: string
  uid: string
  resourceVersion: string
  creationTimestamp: string
  labels: IAgentServiceItemMetadataLabels
  selfLink?: string
  annotations?: Record<string, string>
}

export interface IAgentService {
  metadata: Record<string, any>
  items: V1Service[] | null
}

interface IAgentEndPointsListItemsSubsetsItemAddressesItemTargetRef {
  kind: string
  namespace: string
  name: string
  uid: string
  resourceVersion: string
}

interface IAgentEndPointsListItemsSubsetsItemAddressesItem {
  ip: string
  nodeName: string
  targetRef: IAgentEndPointsListItemsSubsetsItemAddressesItemTargetRef
}

interface IAgentEndPointsListItemsSubsetsItemPortdItem {
  name: string
  port: number
  protocol: string
}

interface IAgentEndPointsListItemsSubsetsItem {
  addresses: IAgentEndPointsListItemsSubsetsItemAddressesItem[]
  ports: IAgentEndPointsListItemsSubsetsItemPortdItem[]
}

interface IAgentEndPointsListItemsItem {
  metadata: IAgentServiceItemMetadata
  subsets: IAgentEndPointsListItemsSubsetsItem[]
}

export interface IAgentEndPointsListItem {
  metadata: Record<string, any>
  items: IAgentEndPointsListItemsItem[] | null
}

export interface IAgentServiceWithEndPoints {
  agentService: IAgentService
  agentEndPointsList: IAgentEndPointsListItem[]
  clusterName: string
}

interface IServicePort {
  name: string
  port: string
  targetPort: string
  protocol: string
  nodePort: string
}

interface IService {
  name: string
  env: string
  cid: string
  ports: string[]
  type: string
  clusterId: string
  portInfos: IServicePort[]
  externalIp: string
  clusterIp: string
  endPoints: string[]
  clusterName: string
  platform: string
}

export interface IServiceList {
  groupName: string
  projectName: string
  totalCount: number
  svcs: IService[]
}

export class GetServiceDetailParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  projectName: string

  @ApiProperty()
  @IsNotEmpty()
  serviceName: string
}

interface IServiceDetailPort {
  port: string
  targetPort: string
  protocol: string
  name: string
}

interface IServiceDetailSelector {
  key: string
  value: string
}

export interface IParsedAgentServiceInfo {
  clusterIp: boolean
  ports: IServiceDetailPort[]
  selector: IServiceDetailSelector[]
  externalName: string
}

export interface IServiceDetail extends IParsedAgentServiceInfo {
  prefix: string
  env: string[]
  cid: string[]
  cluster: string
  type: string
}
