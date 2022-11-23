import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { V1Probe, V1Lifecycle, V1VolumeMount, V1EnvVar, V1RollingUpdateDeployment } from '@kubernetes/client-node'

export class ApplicationConfigParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  projectName: string

  @ApiProperty()
  @IsNotEmpty()
  appName: string
}

export class ApplicationTerminalConfigParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: string

  @ApiProperty()
  @IsNotEmpty()
  projectName: string

  @ApiProperty()
  @IsNotEmpty()
  appName: string
}

export class ApplicationReplayDetailParamsDto extends ApplicationTerminalConfigParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  sessionId: string
}

export class ApplicationConfigHistoryQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  env: string

  @ApiProperty()
  @IsNotEmpty()
  cluster: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  searchBy: string
}

export class ApplicationConfigReleaseQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  env: string

  @ApiProperty()
  @IsNotEmpty()
  cluster: string
}

interface IApplicationConfigPhaseReleaseHealthCheckReadinessProbe {
  type: string
  typeValue: string
  initialDelaySeconds: number
  periodSeconds: number
  successThreshold: number
  timeoutSeconds: number
}

interface IApplicationConfigPhaseReleaseHealthCheck {
  readinessProbe: IApplicationConfigPhaseReleaseHealthCheckReadinessProbe
  livenessProbe: any
}

interface IApplicationConfigPhaseReleaseLifeCycle {
  postStart: string
  preStop: string
}

interface IApplicationConfigPhaseRelease {
  name: string
  image: string
  cpuLimit: number
  memLimit: number
  healthCheck: IApplicationConfigPhaseReleaseHealthCheck
  lifeCycle: IApplicationConfigPhaseReleaseLifeCycle
}

interface IApplicationConfigPhase {
  RELEASE: IApplicationConfigPhaseRelease[]
}

interface IESApplicationConfigStrategyTypeValue {
  maxSurge: string
  maxUnavailable: string
}

interface IESApplicationConfigStrategyType {
  type: string
  value: IESApplicationConfigStrategyTypeValue
}

interface IESEnvironments {
  name: string
  value: string
}

export interface IGetApplicationConfigHistory {
  tenantId: number
  projectName: string
  appName: string
  env: string
  cluster: string
  searchBy?: string
}

export interface IGetESApplication {
  tenantId: number
  projectName: string
  appName: string
  env: string
  cluster: string
  searchBy?: string
}

export interface IESApplicationConfig {
  createTime: number
  operator: string
  cluster: string
  env: string
  group: string
  project: string
  application: string
  phase: IApplicationConfigPhase
  strategyType: IESApplicationConfigStrategyType
  healthCheck: IApplicationConfigPhaseReleaseHealthCheck
  needSpex: boolean
  lifeCycle: string
  environments: IESEnvironments[]
}

export class IApplicationConfigHistoryListDto {
  count: number
  items: IESApplicationConfig[]
}

export interface IGetDeploymentReleaseConfig {
  projectName: string
  appName: string
  env: string
  cluster: string
  cids: string[]
}

interface IHealthCheckValue {
  type: string
  typeValue: string
  initialDelaySeconds: number
  periodSeconds: number
  successThreshold: number
  timeoutSeconds: number
}

interface IHealthCheck {
  readinessProbe: IHealthCheckValue | Record<string, never>
  livenessProbe: IHealthCheckValue | Record<string, never>
}

interface ILifeCycle {
  postStart: string
  preStop: string
}

export class IContainerDetailInfo {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  image: string

  @ApiProperty()
  @IsNotEmpty()
  cpuLimit: number

  @ApiProperty()
  @IsNotEmpty()
  memLimit: number

  @ApiProperty()
  @IsNotEmpty()
  cpuRequest: number

  @ApiProperty()
  @IsNotEmpty()
  memRequest: number

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  healthCheck?: IHealthCheck

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  lifeCycle?: ILifeCycle
}

interface IStrategyTypeValue {
  maxSurge: string
  maxUnavailable: string
}

interface IStrategyType {
  type: string
  value: IStrategyTypeValue
}

interface IEnvironment {
  name: string
  value: string
}

export class IConfigReleaseResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  phase: Record<string, IContainerDetailInfo[]>

  @ApiProperty()
  @IsNotEmpty()
  strategyType: IStrategyType

  @ApiProperty()
  @IsNotEmpty()
  healthCheck: IHealthCheck

  @ApiProperty()
  @IsNotEmpty()
  needSpex: boolean

  @ApiProperty()
  @IsNotEmpty()
  lifeCycle: ILifeCycle

  @ApiProperty()
  @IsNotEmpty()
  environments: IEnvironment[]
}

export interface IDeployInfo {
  phase: string
  strategy: string
  rollingUpdateStrategy: V1RollingUpdateDeployment
  containersDetail: IContainerDetailInfo[]
  livenessProbe: V1Probe
  readinessProbe: V1Probe
  lifecycle: V1Lifecycle
  envs: V1EnvVar[]
  volumes: V1VolumeMount[]
}

export class ICreateApplicationConfigBodyDto extends IConfigReleaseResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  cluster: string

  @ApiProperty()
  @IsNotEmpty()
  env: string
}

export class INewApplicationConfigDto extends IConfigReleaseResponseDto {
  @ApiProperty()
  createTime: number

  @ApiProperty()
  operator: string

  @ApiProperty()
  cluster: string

  @ApiProperty()
  env: string

  @ApiProperty()
  group: string

  @ApiProperty()
  project: string

  @ApiProperty()
  application: string
}
