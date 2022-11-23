import { ArrayNotEmpty, IsNotEmpty, IsString, ValidateNested, IsArray, ArrayMinSize, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ListQueryDto } from 'common/dtos/list.dto'
import { IESEvent } from 'common/modules/event/event.service'
import { REASON } from 'common/constants/deployment'
export class ApiDeployPathParams {
  @IsNotEmpty()
  @ApiProperty()
  tenantId: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  projectName: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  appName: string
}

export class ApiDeploymentClusterInfo extends ApiDeployPathParams {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  deployName: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  clusterName: string
}

export class ScaleDeploys {
  @ApiProperty({ type: String, description: 'Deployment name' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  clusterId: string

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  releaseCount: number

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  canaryValid: boolean

  @ApiPropertyOptional({
    type: Number,
    description: 'Optional, if scale canary it is a must!',
    minimum: 0
  })
  canaryCount?: number

  @ApiProperty()
  appInstanceName: string
}

export class ScaleDeployBody {
  @ApiProperty({
    type: [ScaleDeploys],
    description: 'Deploy list need to be scaled'
  })
  @ValidateNested({ each: true })
  @Type(() => ScaleDeploys)
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  deploys: ScaleDeploys[]
}

class CancelCanaryDeploys {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  clusterId: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string

  @ApiProperty()
  appInstanceName: string

  @ApiProperty()
  canaryCount: number

  @ApiProperty()
  releaseCount: number

  @ApiProperty()
  canaryValid: boolean
}

export class CancelCanaryDeployBody {
  @ApiProperty({ type: [CancelCanaryDeploys] })
  @ValidateNested({ each: true })
  @Type(() => CancelCanaryDeploys)
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  deploys: CancelCanaryDeploys[]
}

export class FullReleaseDeploys {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  clusterId: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string

  @ApiProperty()
  appInstanceName: string
}

export class FullReleaseBody {
  @ApiProperty({ type: [FullReleaseDeploys] })
  @ValidateNested({ each: true })
  @Type(() => FullReleaseDeploys)
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  deploys: FullReleaseDeploys[]
}

export interface IClusterInfo {
  name: string
  config: string
}

interface IMetadata {
  name: string
  namespace: string
  selfLink: string
  uid: string
  resourceVersion: string
  generation: number
  creationTimestamp: string
  labels: {
    application: string
    cid: string
    env: string
    group: string
    project: string
    stable?: string
    feature?: string
    phase?: string
  }
  annotations: {
    [annotation: string]: any
  }
}

interface ISpec {
  replicas: number
  selector: {
    matchLabels: {
      application: string
      cid: string
      env: string
      group: string
      project: string
    }
  }
  template: {
    metadata: {
      creationTimestamp: null
      labels: {
        application: string
        cid: string
        env: string
        group: string
        project: string
      }
      annotations: {
        [annotation: string]: any
      }
    }
    spec: {
      containers: [
        {
          name: string
          image: string
          ports: [
            {
              containerPort: number
              protocol: string
            }
          ]
          resources: {
            limits: {
              cpu: number
              memory: number
            }
            requests: {
              cpu: number
              memory: number
            }
          }
          terminationMessagePath: string
          terminationMessagePolicy: string
          imagePullPolicy: string
        }
      ]
      restartPolicy: string
      terminationGracePeriodSeconds: number
      dnsPolicy: string
      securityContext: any
      schedulerName: string
    }
  }
  strategy: {
    type: string
    rollingUpdate: {
      maxUnavailable: string
      maxSurge: string
    }
  }
  revisionHistoryLimit: number
  progressDeadlineSeconds: number
}

// for cloneset deployment
interface ISpec {
  updateStrategy: {
    type: string
    partition: number
    maxSurge: string
    maxUnavailable: string
  }
}
interface IConditions {
  type: string
  status: string
  lastUpdateTime: string
  lastTransitionTime: string
  reason: string
  message: string
}

interface IStatus {
  observedGeneration: number
  replicas: number
  updatedReplicas: number
  unavailableReplicas: number
  conditions: IConditions[]
  currentRevision: string
  updateRevision: string
}

export interface IItem {
  metadata: IMetadata
  spec: ISpec
  status: IStatus
}

export interface IDeploymentInfo {
  metadata: any
  items: IItem[]
}
export interface IControllerRevisionMetadata {
  name: string
  namespace: string
  uid: string
  resourceVersion: string
  creationTimestamp: string
  labels: any
  annotations: any
}
export interface IControllerRevisionContainer {
  name: string
  image: string
  lifecycle: any
  resources: {
    limits: {
      cpu: string
      memory: string
    }
    requests: {
      cpu: string
      memory: string
    }
  }
}
export interface IControllerRevisionSpec {
  spec: {
    template: {
      spec: {
        containers: IControllerRevisionContainer[]
      }
    }
  }
}
export interface IControllerRevisionItem {
  metadata: IControllerRevisionMetadata
  data: IControllerRevisionSpec
  revision: number
}
export interface IControllerRevisionInfo {
  metadata: any
  items: IControllerRevisionItem[]
}

export interface IDeployCache {
  [key: string]: IItem
}

export interface ILimit {
  cpu: string
  memory: string
}
export interface IContainers {
  cpu: string
  memory: string
  image: string
  limits: ILimit
  name: string
}

export interface IDeploymentCrdInfo {
  apiVersion: string
  kind: string
  metadata: {
    creationTimestamp: string
    finalizers: string[]
    generation: number
    name: string
    namespace: string
    resourceVersion: string
    selfLink: string
    uid: string
    annotations?: any
  }
  spec: {
    application: string
    cid: string
    cluster: string
    deploySpec: {
      containers: IContainers[]
      replicas: number
      resourceVersion: string
    }
    canaryDeploySpec?: {
      containers: IContainers[]
      replicas: number
      resourceVersion: string
    }
    env: string
    feature: string
    group: string
    instance: string
    project: string
    source: string
  }
  status: {
    abnormalPodCount: number
    canaryCount: number
    phase: string[]
    podCount: number
    releaseCount: number
    runningPodCount: number
    status: string
    updateTime: string
  }
}

// export interface IDeploymentCrdInfo {
//   body: IDeploymentCrdBodyInfo
// }

export interface IDeploymentAuth {
  rollbackable?: boolean
  scalable?: boolean
  restartable?: boolean
  fullreleaseable?: boolean
  // killable?: boolean
  editresourceable?: boolean
}

interface IEnv {
  name: string
  value: string
}

interface IVolumeMounts {
  name: string
  readOnly?: boolean
  mountPath: string
}

interface IPorts {
  containerPort: number
  protocol: string
}
export interface IInitContainers {
  name: string
  image: string
  args?: string[]
  ports?: IPorts[]
  env: IEnv[]
  resources: any
  volumeMounts: IVolumeMounts[]
  terminationMessagePath: string
  terminationMessagePolicy: string
  imagePullPolicy: string
  securityContext?: {
    capabilities: {
      add: string[]
    }
    privileged: boolean
  }
}

interface IInitContainerStatuses {
  name: string
  state: {
    terminated: {
      exitCode: number
      reason: string
      startedAt: string
      finishedAt: string
      containerID: string
      signal: number
    }
    waiting: {
      reason: string
    }
  }
  lastState: any
  ready: boolean
  restartCount: number
  image: string
  imageID: string
  containerID: string
}

interface IContainerStatuses {
  name: string
  state: {
    running: {
      startedAt: string
    }
    waiting?: {
      reason: string
    }
    terminated?: {
      reason: string
      signal: number
      exitCode: number
    }
  }
  lastState: any
  ready: boolean
  restartCount: number
  image: string
  imageID: string
  containerID: string
  started: boolean
}

interface IConditions {
  type: string
  status: string
  lastProbeTime: any
  lastTransitionTime: string
}

export interface IPodItem {
  metadata: {
    labels: {
      [map: string]: string
    }
    annotations: {
      [map: string]: string
    }
    creationTimestamp?: string
    name: string
    namespace: string
  }
  spec: {
    initContainers: IInitContainers[]
    containers: IInitContainers[]
    volumes: any[]
    nodeName?: string
    ephemeralContainers?: any
  }
  status: {
    phase: string
    reason?: string
    initContainerStatuses: IInitContainerStatuses[]
    containerStatuses: IContainerStatuses[]
    conditions: IConditions[]
    podIP?: string
    hostIP?: string
  }
  deletionTimestamp?: any
  objectMeta?: any
}

export interface IPod {
  metadata: any
  items: IPodItem[]
}

export class GetDeployContainerTagsRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  tenantId: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  projectName: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  appName: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  deployName: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  containerName: string
}

class IDeployContainerTag {
  @ApiProperty()
  image: string

  @ApiProperty()
  tagname: string

  @ApiProperty()
  timestamp: string
}

export class IGetDeployContainerTagsResponseDto {
  @ApiPropertyOptional()
  name: string

  @ApiPropertyOptional({ type: [IDeployContainerTag] })
  tags: IDeployContainerTag[]
}

export class RollbackDeploymentRequestParamsDto {
  @IsNotEmpty()
  @ApiProperty()
  tenantId: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  projectName: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  appName: string
}

class RollbackContainer {
  @IsNotEmpty({ message: 'container must have image' })
  @IsString({ message: 'container image must be string' })
  @ApiProperty()
  image: string

  @IsNotEmpty({ message: 'container must have name' })
  @IsString({ message: 'container name must be string' })
  @ApiProperty()
  name: string

  @IsNotEmpty({ message: 'container must have tag' })
  @IsString({ message: 'container tag must be string' })
  @ApiProperty()
  tag: string
}

class RollbackDeployment {
  @IsNotEmpty({ message: 'deployment name cannot be empty' })
  @IsString({ message: 'clusterId must be string' })
  @ApiProperty({ type: String })
  clusterId: string

  @ValidateNested({ each: true })
  @Type(() => RollbackContainer)
  @IsNotEmpty({ message: 'must specify containers needed to be rollout' })
  @ArrayNotEmpty({ message: 'must contain at least one container for rollout' })
  @ApiProperty({ type: [RollbackContainer] })
  containers: RollbackContainer[]

  @IsNotEmpty({ message: 'deployment must contain rollback name' })
  @IsString({ message: 'deployment name must be string' })
  @ApiProperty({ type: String })
  name: string

  @ApiProperty()
  appInstanceName: string
}

export class RollbackDeploymentRequestBodyDto {
  @ValidateNested({ each: true })
  @Type(() => RollbackDeployment)
  @IsNotEmpty()
  @ValidateNested({
    each: true
  })
  @Type(() => RollbackDeployment)
  @ApiProperty({ type: [RollbackDeployment] })
  deploys: RollbackDeployment[]
}

export class RolloutRestartDeploymentRequestParamsDto {
  @IsNotEmpty()
  @ApiProperty()
  tenantId: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  projectName: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  appName: string
}

class RolloutRestartDeployment {
  @IsNotEmpty({ message: 'deployment name cannot be empty' })
  @IsString({ message: 'clusterId must be string' })
  @ApiProperty()
  clusterId: string

  @IsNotEmpty({ message: 'deployment must contain name' })
  @IsString({ message: 'deployment name must be string' })
  @ApiProperty()
  name: string

  @ArrayNotEmpty({ message: 'must specify one phase' })
  @ApiProperty({ type: [String] })
  phases: string[]

  @ApiProperty()
  appInstanceName: string
}

export class RolloutRestartDeploymentRequestBodyDto {
  @IsNotEmpty()
  @ValidateNested({
    each: true
  })
  @Type(() => RolloutRestartDeployment)
  @ApiProperty({ type: [RolloutRestartDeployment] })
  deploys: RolloutRestartDeployment[]
}

export interface IDeploymentData {
  cluster: string
  env: string
  cid: string
  fte: string
  phase: string[]
}

export class IDeployScaleResponseDto {
  @ApiProperty()
  result: string
}

export class IDeploymentEventsParamsDto extends ApiDeployPathParams {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  deployName: string
}

export class IDeploymentEventsQuery {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  clusterId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phase: string

  @ApiPropertyOptional()
  @ApiProperty()
  @IsOptional()
  @IsString()
  types: string
}

export type IGetDeploymentEvents = IDeploymentEventsQuery & IDeploymentEventsParamsDto

export interface IDeploymentPodInfo {
  tenantId: number
  projectName: string
  appName: string
  name: string
  namespace: string
  nodeName: string
}

export interface IDeploymentPodsInfo {
  pods: IPodItem[]
  totalCount: number
}

export class IDeploymentLatestEvent {
  @ApiProperty({ type: IESEvent })
  event: IESEvent

  @ApiProperty()
  totalCount: number

  @ApiProperty()
  type: string
}

export interface IPodFirstEventsArgs {
  customPod: IDeploymentPodInfo
  reason?: REASON[]
  searchAll?: string[]
}

export class IDeploymentLatestEvents {
  @ApiProperty({ type: [IDeploymentLatestEvent] })
  events: IDeploymentLatestEvent[]

  @ApiProperty()
  totalCount: number
}

export class IDeploymentDetailResponseInfo {
  @ApiProperty()
  phase: string

  @ApiProperty()
  podCount: number

  @ApiProperty()
  appInstanceName: string

  @ApiProperty()
  releaseCount: number

  @ApiProperty()
  canaryCount: number

  @ApiProperty()
  clusterId: number

  @ApiProperty()
  deployName: string

  @ApiProperty()
  name: string

  @ApiProperty()
  env: string

  @ApiProperty()
  cid: string
}

export class IAbnormalPod {
  @ApiProperty()
  runningUnhealth: number

  @ApiProperty()
  error: number

  @ApiProperty()
  crashBackOff: number

  @ApiProperty()
  other: number
}

export class IDeploymentDetailResponseDto {
  @ApiPropertyOptional({ type: IAbnormalPod })
  abnormalPod?: IAbnormalPod

  @ApiProperty()
  clusterName: string

  @ApiProperty()
  clusters: { [key: string]: string }

  @ApiProperty()
  containerDetails: { [key: string]: unknown[] }

  @ApiPropertyOptional()
  desiredPod: number

  @ApiPropertyOptional()
  info: IDeploymentDetailResponseInfo

  @ApiProperty()
  name: string

  @ApiPropertyOptional()
  normalPod: number
}
