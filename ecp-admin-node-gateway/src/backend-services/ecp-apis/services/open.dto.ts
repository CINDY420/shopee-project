/* eslint-disable */

export type ICronRuleRepeatType = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MON'

export type ICronRuleWeekday =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'

export class IOpenapiv2Status {
  containerStatuses?: IV2ContainerStatus[]
}

export class IV2AZMappingRecord {
  version?: string
  azKey?: string
}

export class IV2AddAppClusterConfigRequest {
  env?: string
  azKey?: string
  segmentKey?: string
  clusterUuid?: string
  scope?: string
  key?: string
  cmdbTenantId?: string
}

export class IV2AddAppClusterConfigResponse {
  id?: string
}

export class IV2AddClusterMetaRequest {
  uuid?: string
  displayName?: string
  kubeConfig?: string
  azV1?: string
  azV2?: string
  segmentKey?: string
  monitoringUrl?: string
  kubeApiserverType?: string
  ecpVersion?: string
  handleByGalio?: boolean
  platform?: string
  clusterType?: string
  karmadaKubeConfig?: string
  labels?: string[]
  descriptions?: string
  useOam?: boolean
  useQuota?: boolean
  metricStoreName?: string
}

export class IV2AddClusterMetaResponse {}

export class IV2AppClusterConfig {
  id?: string
  env?: string
  azKey?: string
  segmentKey?: string
  clusterUuid?: string
  scope?: string
  key?: string
  cid?: string
  cmdbTenantId?: string
}

export class IV2AutoscalingRule {
  metrics?: string
  threshold?: number
}

export class IV2Az {
  name?: string
  version?: string
}

export class IV2AzDetail {
  name?: string
  capability?: string[]
  env?: string
  version?: string
  clusters?: string[]
  azKey?: string
}

export class IV2Behavior {
  scaleUp?: IV2HPAScalingRules
  scaleDown?: IV2HPAScalingRules
}

export class IV2BulkGetSdusResponse {
  items?: IV2SDU[]
  totalSize?: number
}

export class IV2BulkGetServiceDeploymentsResponse {
  items?: IV2ServiceDeployment[]
  total?: number
}

export class IV2ClusterAlarm {
  type?: string
  resourceName?: string
  message?: string
  title?: string
}

export class IV2ClusterDetail {
  meta?: IV2ClusterMeta
  status?: IV2ClusterStatus
}

export class IV2ClusterMeta {
  uuid?: string
  displayName?: string
  kubeConfig?: string
  azV1?: string
  azV2?: string
  regionKey?: string
  segmentKey?: string
  monitoringUrl?: string
  kubeApiserverType?: string
  ecpVersion?: string
  handleByGalio?: boolean
  platform?: string
  clusterType?: string
  karmadaKubeConfig?: string
  labels?: string[]
  descriptions?: string
  createTs?: string
  azForDepconf?: string
  observabilityLink?: string
  karmadaClusterUuid?: string
}

export class IV2ClusterNode {
  name?: string
  podSummary?: IV2CommonSummary
  metrics?: IV2ResourceMetrics
  status?: string
  privateIp?: string
  roles?: string[]
  labels?: IV2CommonLabel[]
  taints?: IV2CommonTaint[]
}

export class IV2ClusterStatus {
  nodeSummary?: IV2CommonSummary
  podSummary?: IV2CommonSummary
  metrics?: IV2ResourceMetrics
  status?: string
  alarms?: IV2ClusterAlarm[]
  health?: string
  observabilityLink?: string
  healthGalioMsg?: string
  healthKamardaMsg?: string
}

export class IV2CommonLabel {
  key?: string
  value?: string
}

export class IV2CommonResouce {
  capacity?: number
  reserved?: number
  assigned?: number
  free?: number
  used?: number
  usedUsage?: number
  assignedUsage?: number
  workerAllocatable?: number
  allocatable?: number
}

export class IV2CommonSummary {
  capacity?: number
  count?: number
  unhealthyCount?: number
}

export class IV2CommonTaint {
  key?: string
  value?: string
  effect?: string
}

export class IV2Container {
  name?: string
  image?: string
  phase?: string
  tag?: string
  timestamp?: string
}

export class IV2ContainerInfo {
  containerId?: string
  contianerName?: string
  containerName?: string
}

export class IV2ContainerState {
  terminated?: IV2ContainerStateTerminated
}

export class IV2ContainerStateTerminated {
  exitCode?: number
  signal?: number
  reason?: string
  message?: string
  containerId?: string
}

export class IV2ContainerStatus {
  name?: string
  containerId?: string
  image?: string
  imageId?: string
  ready?: boolean
  state?: IV2ContainerState
  lastState?: IV2ContainerState
}

export class IV2CreateDeploymentRequest {
  metadata?: IV2DeployMetadata
  components?: IV2DeployComponent[]
  canary?: boolean
}

export class IV2CreateDeploymentResponse {
  deployId?: string
}

export class IV2CreatePVSecretRequest {
  name?: string
  serviceId?: string
  serviceName?: string
  project?: string
  module?: string
  env?: string
  az?: string
  ussAppid?: string
  ussAppSecret?: string
  intranetDomain?: string
}

export class IV2CreatePVSecretResponse {
  uuid?: string
}

export class IV2CreatePvPvcRequest {
  name?: string
  serviceId?: string
  serviceName?: string
  project?: string
  module?: string
  env?: string
  cid?: string
  az?: string
  secret?: string
  accessMode?: string
  subpath?: string
}

export class IV2CreatePvPvcResponse {
  uuid?: string
}

export class IV2CronRule {
  repeatType?: ICronRuleRepeatType
  startTime?: string
  endTime?: string
  targetCount?: number
  startWeekday?: ICronRuleWeekday
  endWeekday?: ICronRuleWeekday
}

export type IV2DEPLOYSTATUS = 'BEGINING' | 'RENDERING' | 'HEALTHCHECKING' | 'RUNNING'

export class IV2DRInfo {
  dr?: string
  zone?: string
}

export class IV2DeletePVPVCResponse {
  uuid?: string
}

export class IV2DeletePVSecretResponse {
  uuid?: string
}

export class IV2DeployComponent {
  type?: string
  settings?: string
  traits?: IV2DeployTrait[]
}

export class IV2DeployMetadata {
  project?: string
  module?: string
  env?: string
  cid?: string
  az?: string
  cluster?: string
  feature?: string
  bundle?: string
  serviceName?: string
}

export class IV2DeployTrait {
  type?: string
  settings?: string
}

export class IV2DeploymentCancelCanaryResponse {}

export class IV2DeploymentEditResourceResponse {}

export class IV2DeploymentHistory {
  containers?: IV2Container[]
  deploymentId?: string
  state?: string
  lastDeployed?: number
}

export class IV2DeploymentPreviewResponse {
  az?: string
  tag?: string
  totalInstances?: string
}

export class IV2ECPEnumerations {
  type?: string
  enums?: string[]
}

export class IV2ECPTree {
  rootType?: string
  rootKey?: string
  leafType?: string
  leafKey?: string[]
}

export class IV2Event {
  name?: string
  namespace?: string
  kind?: string
  reason?: string
  message?: string
  hostIp?: string
  podIp?: string
  createTime?: string
}

export class IV2FileInfo {
  gid?: string
  groupName?: string
  isDir?: boolean
  modTime?: string
  mod?: number
  modStr?: string
  name?: string
  path?: string
  size?: string
  uid?: number
  userName?: string
}

export class IV2FullReleaseDeploymentResponse {}

export class IV2GetDeployResultResponse {
  status?: IV2DEPLOYSTATUS
  reason?: string
}

export class IV2GetDeploymentHistoryResponse {
  list?: IV2DeploymentHistory[]
}

export class IV2GetLogFileContentResponse {
  fileContent?: string
}

export class IV2GetPodDetailResponse {
  pod?: IV2Pod
}

export class IV2GetPodLogsResponse {
  data?: string
}

export class IV2GetPodMetaResponse {
  podMeta?: IV2PodMeta
}

export class IV2GetPodsMetricsResponse {
  items?: IV2PodMetrics[]
}

export class IV2GetRollbackDeploymentPreviewResponse {
  old?: IV2DeploymentPreviewResponse
  new?: IV2DeploymentPreviewResponse
}

export class IV2GetSDUAzDRInfoResponse {
  drInfo?: IV2DRInfo
}

export class IV2GetSDUSummaryResponse {
  summary?: IV2WorkloadSummary
}

export class IV2GetServiceDeploymentEventsResponse {
  events?: IV2Event[]
  kindList?: string[]
  total?: number
}

export class IV2GetServiceDeploymentMetaResponse {
  deployment?: IV2ServiceDeployment
}

export class IV2HPAScalingRules {
  stabilizationWindowSeconds?: number
  notifyFailed?: boolean
  selected?: boolean
}

export class IV2HealthCheckResponse {
  app?: string
  message?: string
}

export class IV2HpaObject {
  id?: number
  meta?: IV2Meta
  spec?: IV2HpaSpec
}

export class IV2HpaSpec {
  autoscalingLogic?: string
  triggerRules?: IV2TriggerRules[]
  behavior?: IV2Behavior
  maxReplicaCount?: number
  minReplicaCount?: number
  status?: number
  notifyChannel?: string
  updator?: string
  updatedTime?: string
}

export class IV2Identifier {
  project?: string
  module?: string
}

export class IV2IsPVSecretExistRequest {
  serviceId?: string
  ussAppid?: string
  env?: string
}

export class IV2IsPVSecretExistResponse {
  exist?: boolean
}

export class IV2KillPodResponse {}

export class IV2ListAppClusterConfigResponse {
  total?: string
  items?: IV2AppClusterConfig[]
}

export class IV2ListAzDetailResponse {
  items?: IV2AzDetail[]
}

export class IV2ListClusterDetailResponse {
  total?: number
  items?: IV2ClusterDetail[]
}

export class IV2ListClusterMetaResponse {
  total?: number
  items?: IV2ClusterMeta[]
}

export class IV2ListClusterNodesResponse {
  total?: number
  nodes?: IV2ClusterNode[]
  summary?: IV2NodeStatusSummary
  roles?: string[]
}

export class IV2ListDeployZoneResponse {
  totalSize?: number
  items?: IV2Zone[]
}

export class IV2ListDeploymentPodsResponse {
  items?: IV2Pod[]
  total?: number
}

export class IV2ListPVPVCResponse {
  pvPvc?: IV2PvPvc[]
}

export class IV2ListPVSecretResponse {
  pvSecret?: IV2PVSecret[]
}

export class IV2ListPodLogFilesResponse {
  files?: IV2FileInfo[]
}

export class IV2ListSDUHpasResponse {
  items?: IV2HpaObject[]
  total?: number
}

export class IV2ListSDUsResponse {
  items?: IV2SDU[]
  totalSize?: number
}

export class IV2ListSDUsSummaryResponse {
  items?: IV2WorkloadSummary[]
  totalSize?: number
}

export class IV2ListServiceDeploymentsResponse {
  items?: IV2ServiceDeployment[]
  total?: number
}

export class IV2ListWorkloadResponse {
  items?: IV2WorkloadDetail[]
}

export class IV2Meta {
  sdu?: string
  az?: string
}

export class IV2NodeStatusSummary {
  readyCount?: number
  notReadyCount?: number
  unknownCount?: number
  total?: number
}

export class IV2PVSecret {
  id?: string
  serviceId?: string
  serviceName?: string
  uuid?: string
  name?: string
  project?: string
  module?: string
  env?: string
  az?: string
  ussAppid?: string
  ussAppSecret?: string
  intranetDomain?: string
  updatedAt?: string
}

export class IV2Pod {
  podName?: string
  nodeName?: string
  clusterName?: string
  namespace?: string
  sdu?: string
  cid?: string
  env?: string
  nodeIp?: string
  podIp?: string
  podPort?: number
  status?: string
  createdTime?: number
  phase?: string
  tag?: string
  restartCount?: number
  lastRestartTime?: number
  idc?: string
  containerInfo?: IV2ContainerInfo[]
  message?: string
  hostIp?: string
  podStatus?: IOpenapiv2Status
}

export class IV2PodMeta {
  ip?: string
  podCreatedTime?: string
  cmdbServiceName?: string
  idc?: string
  azv2?: string
}

export class IV2PodMetrics {
  podName?: string
  namespace?: string
  cpu?: IV2Usage
  memory?: IV2Usage
}

export class IV2PvPvc {
  id?: string
  uuid?: string
  name?: string
  serviceId?: string
  serviceName?: string
  project?: string
  module?: string
  env?: string
  cid?: string
  az?: string
  secret?: string
  accessMode?: string
  subpath?: string
  status?: string
  updatedAt?: string
}

export class IV2QueryAZMappingResponse {
  version?: string
  items?: IV2AZMappingRecord[]
}

export class IV2QueryClusterDetailResponse {
  detail?: IV2ClusterDetail
}

export class IV2QueryECPEnumerationsResponse {
  allenums?: IV2ECPEnumerations[]
}

export class IV2QueryECPTreeResponse {
  tree?: IV2ECPTree
}

export class IV2QueryTargetClusterForSDURequest {
  serviceName?: string
  items?: IV2TargetClusterForSDURequest[]
}

export class IV2QueryTargetClusterForSDUResponse {
  items?: IV2TargetClusterForSDUResponse[]
}

export class IV2QueryTargetClusterForServiceRequest {
  serviceName?: string
  items?: IV2TargetClusterForServiceRequest[]
}

export class IV2QueryTargetClusterForServiceResponse {
  items?: IV2TargetClusterForServiceResponse[]
}

export class IV2RemoveAppClusterConfigResponse {}

export class IV2ResourceMetrics {
  cpu?: IV2CommonResouce
  memory?: IV2CommonResouce
  disk?: IV2CommonResouce
  gpu?: IV2CommonResouce
}

export class IV2RestartDeploymentResponse {}

export class IV2RetryCreatePvPvcRequest {
  uuid?: string
  name?: string
  serviceId?: string
  serviceName?: string
  project?: string
  module?: string
  env?: string
  cid?: string
  az?: string
  secret?: string
  accessMode?: string
  subpath?: string
}

export class IV2RetryCreatePvPvcResponse {
  uuid?: string
}

export class IV2RollbackDeploymentResponse {}

export class IV2SDU {
  sduId?: number
  serviceId?: number
  sdu?: string
  resourceType?: string
  env?: string
  cid?: string
  idcs?: string[]
  version?: string
  deploymentLink?: string
  identifier?: IV2Identifier
  serviceName?: string
  summary?: IV2WorkloadSummary
}

export class IV2ScaleDeploymentResponse {}

export class IV2ServiceDeployment {
  deployId?: string
  sduName?: string
  project?: string
  module?: string
  env?: string
  cid?: string
  feature?: string
  bundle?: string
  azV1?: string
  azV2?: string
  cluster?: string
  clusterType?: string
  deployEngine?: string
  componentType?: string
  summary?: IV2WorkloadSummary
  status?: IV2WorkloadStatus
  azFromDepConfig?: IV2Az
}

export class IV2SimplePod {
  podName?: string
  namespace?: string
}

export class IV2StopDeploymentResponse {}

export class IV2StopResourceBySduResponse {}

export class IV2SuspendDeploymentResponse {}

export class IV2TargetClusterForSDURequest {
  env?: string
  cid?: string
  azKey?: string
  allocWhenQuery?: boolean
}

export class IV2TargetClusterForSDUResponse {
  request?: IV2TargetClusterForSDURequest
  cluster?: IV2TargetClusterMeta
}

export class IV2TargetClusterForServiceRequest {
  env?: string
  azKey?: string
  allocWhenQuery?: boolean
}

export class IV2TargetClusterForServiceResponse {
  request?: IV2TargetClusterForServiceRequest
  clusters?: IV2TargetClusterMeta[]
}

export class IV2TargetClusterMeta {
  uuid?: string
  kubeconfig?: string
}

export class IV2TriggerRules {
  type?: string
  autoscalingRule?: IV2AutoscalingRule
  cronRule?: IV2CronRule
}

export class IV2UpdatePVSecretRequest {
  uuid?: string
  serviceId?: string
  serviceName?: string
  name?: string
  project?: string
  module?: string
  env?: string
  az?: string
  ussAppid?: string
  ussAppSecret?: string
  intranetDomain?: string
}

export class IV2UpdatePVSecretResponse {
  uuid?: string
}

export class IV2Usage {
  applied?: number
  used?: number
}

export class IV2WorkloadDetail {
  env?: string
  az?: string
  workloads?: IV2workloadMeta[]
}

export class IV2WorkloadStatus {
  reason?: string
  orchestrator?: string
  containers?: IV2Container[]
}

export class IV2WorkloadSummary {
  sduName?: string
  cpu?: number
  mem?: number
  disk?: number
  healthyInstances?: number
  killingInstances?: number
  runningInstances?: number
  stagingInstances?: number
  startingInstances?: number
  targetInstances?: number
  unhealthyInstances?: number
  unknownInstances?: number
  releaseInstances?: number
  canaryInstances?: number
  state?: string
  lastDeployed?: number
}

export class IV2Zone {
  zoneName?: string
  az?: string
  description?: string
}

export class IV2workloadMeta {
  name?: string
  nameDisplay?: string
  type?: string
  category?: string
  orchestrators?: string[]
}
