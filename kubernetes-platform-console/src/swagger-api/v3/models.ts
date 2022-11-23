export interface IProjectApplication {
  cids: string[]
  environments: string[]
  name: string
  status: string
}

export interface IProjectApplicationsResponseDto {
  apps: IProjectApplication[]
  tenantName: string
  tenantId: number
  projectName: string
  totalCount: number
}

export interface IApplicationGetResponseDto {
  cids: string[]
  clusters: string[]
  envs: string[]
  tenantName: string
  tenantId: number
  name: string
  projectName: string
  envPods: {}
  projectEnvs: string[]
}

export interface IICreateApplicationDto {
  appName: string
}

export interface IIApplicationTemplate {
  project: string
  app: string
}

export interface IApplicationDeploysFilterInfo {
  cids: string[]
  clusters: string[]
  envs: string[]
  name: string
}

export interface IContainerInfo {
  image: string
  name: string
  tag: string
}

export interface IDeployInfo {
  name?: string
  podCount?: number
  releaseCount?: number
  canaryCount?: number
  status?: string
  containers?: IContainerInfo[]
  phase?: string
  updateTime?: string
  clusterId?: string
  scalable?: boolean
  rollbackable?: boolean
  fullreleaseable?: boolean
  restartable?: boolean
  appInstanceName?: string
  clusterName?: string
  monitoringClusterName?: string
  abnormalPodCount?: number
  runningPodCount?: number
  deployName?: string
}

export interface IApplicationDeploysResponseDto {
  groupName: string
  projectName: string
  appName: string
  totalCount: number
  deploys: IDeployInfo[]
  phaseList: string[]
}

export interface IIEvent {
  name: string
  namespace: string
  kind: string
  reason: string
  message: string
  hostip?: string
  podip?: string
  creationTimestamp: string
}

export interface IGetApplicationEventsResponseDto {
  totalCount: number
  events: IIEvent[]
  kindList: string[]
}

export interface IIApplicationConfigHistoryListDto {}

export interface IIConfigReleaseResponseDto {
  phase: {}
  strategyType: {}
  healthCheck: {}
  needSpex: boolean
  lifeCycle: {}
  environments: string[]
}

export interface IICreateApplicationConfigBodyDto {
  phase: {}
  strategyType: {}
  healthCheck: {}
  needSpex: boolean
  lifeCycle: {}
  environments: string[]
  cluster: string
  env: string
}

export interface IINewApplicationConfigDto {
  phase: {}
  strategyType: {}
  healthCheck: {}
  needSpex: boolean
  lifeCycle: {}
  environments: string[]
  createTime: number
  operator: string
  cluster: string
  env: string
  group: string
  project: string
  application: string
}

export interface ILog {
  container: string
  detail: string
  nodeIP: string
  nodeName: string
  operator: string
  podIP: string
  podName: string
  time: string
  sessionId: string
}

export interface IApplicationTerminalLogsResponseDto {
  data: ILog[]
  totalCount: number
}

export interface IReplay {
  container: string
  nodeIP: string
  nodeName: string
  operator: string
  podIP: string
  podName: string
  time: string
  sessionId: string
  duration: string
}

export interface IApplicationTerminalReplaysResponseDto {
  data: IReplay[]
  totalCount: number
}

export interface IWriteStream {}

export interface IICids {
  cid: string
  clusterIds: string[]
}

export interface IIClusters {
  cids: IICids[]
  environment: string
}

export interface IIQuota {
  used: number
  assigned: number
  total: number
  limit: number
}

export interface IIDetail {
  name: string
  envName: string
  cpu: IIQuota
  memory: IIQuota
}

export interface IIProjectQuotaDto {
  name: string
  resourceQuotas: IIDetail[]
}

export interface IIProjectQuotasDto {
  clusters: IIProjectQuotaDto[]
}

export interface IIGetProjectDetailDtoResponse {
  cids: string[]
  clusters: IIClusters[]
  envClusterMap: {}
  envs: string[]
  tenantName: string
  tenantId: number
  name: string
  quotas: IIProjectQuotasDto
  simpleClusters: string[]
}

export interface IClusterListByConfigInfoResponse {
  clusterIds: string[]
}

export interface IIProjectListItem {
  cids: string[]
  clusters: string[]
  envs: string[]
  name: string
  tenant: string
}

export interface IIProjectListResult {
  tenantName: string
  tenantId: number
  projects: IIProjectListItem[]
  totalCount: number
}

export interface IItMetricsQuotaItem {
  used: number
  applied: number
  alarm: string
  total: number
}

export interface IIGetMetricsResult {
  cluster: string
  env: string
  quota: IIQuota
}

export interface IIResourceQuotaInfo {
  cpuTotal: number
  memoryTotal: number
  name: string
}

export interface IIPlayLoadInfo {
  quotas: IIResourceQuotaInfo[]
  cids: string[]
  project: string
}

export interface IIESProjectDetailResponse {
  cids: string[]
  environments: string[]
  relations: string[]
  tenant: string
  project: string
  clusters: string[]
  createtime: string
  updatetime: string
  quotas: IIResourceQuotaInfo[]
}

export interface IUpdateResourceQuotasBody {
  projectQuotas: string[]
}

export interface IICrdQuota {
  name: string
  cpu: number
  memory: number
  env: string
  cluster: string
}

export interface IITransferProjectDto {}

export interface IClusterInfoConfig {
  name: string
  kubeconfig: string
}

export interface IClusterInfoAlarm {
  type: string
  resourceName: string
  detail: {}
}

export interface IClusterInfoHealthySummary {
  count: number
  unhealthyCount: number
}

export interface IClusterInfoMetrics {
  capacity: number
  reserved: number
  assigned: number
  free: number
  used: number
  assignedUsage: number
  usedUsage: number
  workerAllocatable?: number
  quotaTotal?: number
}

export interface IMetrics {
  cpu: IClusterInfoMetrics
  memory: IClusterInfoMetrics
}

export interface IClusterInfoDto {
  id: string
  name: string
  creationTimestamp: string
  config: IClusterInfoConfig
  status: 'Healthy' | 'Unhealthy' | 'Unknown'
  alarms: IClusterInfoAlarm[]
  nodeSummary: IClusterInfoHealthySummary
  podSummary: IClusterInfoHealthySummary
  metrics: IMetrics
  envs: string[]
  cids: string[]
  groups: string[]
}

export interface IClusterCreateBodyDto {
  kubeconfig: string
  name: string
}

export interface IClusterDeleteResponseDto {}

export interface IClusterConfigDto {
  cids: string[]
  environments: string[]
  tenants: string[]
}

export interface IClusterInfoListDto {
  clusters: IClusterInfoDto[]
  totalCount: number
}

export interface IClassNamesDto {
  names: string[]
}

export interface IIResourceQuotaDetail {
  cpu: IIQuota
  envName: string
  memory: IIQuota
  name: string
}

export interface IIGroupResourceQuotaInCluster {
  name: string
  alias?: string
  resourceQuotas: IIResourceQuotaDetail[]
}

export interface IIGetClusterQuotasResponseDto {
  groups: IIGroupResourceQuotaInCluster[]
}

export interface IClusterUpdateQuotaDto {
  cpuTotal: number
  memoryTotal: number
  name: string
}

export interface IClusterUpdateQuotasBodyDto {
  quotasConfig: IClusterUpdateQuotaDto[]
}

export interface IGetClusterEventsResponseDto {
  totalCount: number
  events: IIEvent[]
  kindList: string[]
}

export interface IFlavor {
  cpu: number
  memory: number
}

export interface IClusterFlavorResponse {
  flavors: IFlavor[]
}

export interface IClustersFlavors {
  flavors: IFlavor[]
  clusters: string[]
}

export interface IAddClustersFlavorsRequest {
  clustersFlavors: IClustersFlavors[]
}

export interface IUpdateClusterFlavorsRequest {
  added: IFlavor[]
  removed: IFlavor[]
}

export interface IIUsage {
  total: number
  applied: number
  used: number
  Ready: boolean
  alarm: string
}

export interface IINodeTaint {
  key: string
  value: string
  effect: string
}

export interface IINode {
  cluster: string
  name: string
  IP: string
  roles: string[]
  status: string
  statusExtra: string[]
  cpuMetrics: IIUsage
  memMetrics: IIUsage
  podMetrics: IIUsage
  taints: IINodeTaint
  labels: {}
}

export interface INodeListResponse {
  totalCount: number
  nodes: IINode[]
}

export interface INodeActionBasePayload {
  nodes: string[]
}

export interface INodeActionResponse {
  success: string[]
  fail: string[]
}

export interface INodeLabelPayload {
  nodes: string[]
  labels: {}
}

export interface INodeTaintPayload {
  nodes: string[]
  action: string
  taint: IINodeTaint
}

export interface IIContainerResponse {
  image: string
  name: string
  tag: string
}

export interface IIPodUsage {
  used: number
  applied: number
  Ready: boolean
  alarm: string
  total: number
}

export interface IIPodBaseResponse {
  name: string
  nodeName: string
  projectName: string
  appName: string
  groupName: string
  clusterId: string
  namespace: string
  cid: string
  environment: string
  nodeIP: string
  podIP: string
  status: string
  creationTimestamp: string
  containers: IIContainerResponse[]
  cpu: IIPodUsage
  memory: IIPodUsage
  phase: string
  traceId: string
  restart: {}
  supportProfiling: boolean
  tenantId: number
}

export interface IINodePodListResponse {
  pods: IIPodBaseResponse[]
  totalCount: number
  statusList: string[]
}

export interface IIGroupDetail {
  name: string
  id: string
  envs: string[]
  cids: string[]
  clusters: string[]
  envClusterMap: {}
}

export interface IIMetricsDto {
  cluster: number
  env: number
  quota: IIQuota
}

export interface IITenant {
  id: number
  name: string
  detail: string
  createAt: string
  updateAt: string
}

export interface IITenantList {
  tenantList: IITenant[]
  totalCount: number
}

export interface IICreateTenantBodyDto {
  name: string
  detail: string
}

export interface IIUpdateTenantBodyDto {
  name: string
  detail: string
}

export interface IIAddTenantUsersBodyDto {
  emails: string[]
  roleId: number
}

export interface IIUpdateTenantUserBodyDto {
  roleId: number
}

export interface IIAddTenantBotBodyDto {
  name: string
  password: string
  detail: string
  roleId: number
}

export interface IIUpdateTenantBotBodyDto {
  name: string
  password: string
  detail: string
  roleId: number
}

export interface IIGenerateBotAccessTokenBodyDto {
  password: string
}

export interface IIAbnormalPod {
  runningUnhealth: number
  error: number
  crashBackOff: number
  other: number
}

export interface IIDeploymentDetailResponseInfo {
  phase: string
  podCount: number
  appInstanceName: string
  releaseCount: number
  canaryCount: number
  clusterId: number
  deployName: string
  name: string
  env: string
  cid: string
}

export interface IIDeploymentDetailResponseDto {
  abnormalPod?: IIAbnormalPod
  clusterName: string
  clusters: {}
  containerDetails: {}
  desiredPod?: number
  info?: IIDeploymentDetailResponseInfo
  name: string
  normalPod?: number
}

export interface IPhaseResource {
  container: string
  cpuLimit: number
  memLimit: number
}

export interface IPhase {
  phase: string
  resource: IPhaseResource[]
}

export interface IUpdateDeployLimitBody {
  phases: IPhase[]
  appInstanceName: string
}

export interface IUpdateDeployLimitResponse {}

export interface IIDeployContainerTag {
  image: string
  tagname: string
  timestamp: string
}

export interface IIGetDeployContainerTagsResponseDto {
  name?: string
  tags?: IIDeployContainerTag[]
}

export interface IScaleDeploys {
  name: string
  clusterId: string
  releaseCount: number
  canaryValid: boolean
  canaryCount?: number
  appInstanceName: string
}

export interface IScaleDeployBody {
  deploys: IScaleDeploys[]
}

export interface IIDeployScaleResponseDto {
  result: string
}

export interface ICancelCanaryDeploys {
  clusterId: string
  name: string
  appInstanceName: string
  canaryCount: number
  releaseCount: number
  canaryValid: boolean
}

export interface ICancelCanaryDeployBody {
  deploys: ICancelCanaryDeploys[]
}

export interface IFullReleaseDeploys {
  clusterId: string
  name: string
  appInstanceName: string
}

export interface IFullReleaseBody {
  deploys: IFullReleaseDeploys[]
}

export interface IRollbackContainer {
  image: string
  name: string
  tag: string
}

export interface IRollbackDeployment {
  clusterId: string
  containers: IRollbackContainer[]
  name: string
  appInstanceName: string
}

export interface IRollbackDeploymentRequestBodyDto {
  deploys: IRollbackDeployment[]
}

export interface IRolloutRestartDeployment {
  clusterId: string
  name: string
  phases: string[]
  appInstanceName: string
}

export interface IRolloutRestartDeploymentRequestBodyDto {
  deploys: IRolloutRestartDeployment[]
}

export interface IRollingUpdateStrategy {
  maxSurge: string
  maxUnavailable: number
}

export interface IGetDeploymentBasicInfoResponseDto {
  name: string
  phase: {}
  pods: {}
  rollingUpdateStrategy: IRollingUpdateStrategy
  strategy: string
}

export interface IIESEvent {
  cluster: string
  project: string
  application: string
  name: string
  namespace: string
  kind: string
  reason: string
  message: string
  createtime: string
  detail: string
  hostip: string
  podip: string
}

export interface IIDeploymentLatestEvent {
  event: IIESEvent
  totalCount: number
  type: string
}

export interface IIDeploymentLatestEvents {
  events: IIDeploymentLatestEvent[]
  totalCount: number
}

export interface IDeleteDeploymentBody {
  phase: string
  cluster: string
}

export interface IIPodListResponse {
  pods: IIPodBaseResponse[]
  totalCount: number
  statusList: string[]
  phaseList: string[]
}

export interface IGraph {
  x: number
  y: number
}

export interface IMetric {
  Ready: boolean
  capacity: number
  graph: IGraph[]
  status: string
  used: number
}

export interface IVolume {
  mountPoint: string
  name: string
  readonly: string
  source: string
  type: string
}

export interface IGetPodDetailResponseDto {
  appName: string
  cid: string
  clusterId: string
  clusterName: string
  containers: string[]
  cpu: IMetric
  creationTimestamp: string
  environment: string
  filesystem: IMetric
  groupName: string
  labels: string[]
  memRss: IMetric
  memory: IMetric
  name: string
  nodeIP: string
  nodeName: string
  phase: string
  traceId: string
  podIP: string
  podPort: string
  projectName: string
  status: string
  tag: string
  volumes: IVolume[]
  namespace: string
  tenantId: number
  zoneName: string
}

export interface IGetPodContainerResponseDto {
  pairs: {}
}

export interface IIPayloadPod {}

export interface IIBatchDeletePodsPayload {
  pods: IIPayloadPod[]
}

export interface IFile {
  filesize: string
  name: string
  updateTime: string
}

export interface IGetLogDirectoryResponseDto {
  files: IFile[]
}

export interface IGetPodPreviousLogResponse {
  logString: string
  message: string
}

export interface IITenantTreeProjectItem {
  clusters: string[]
  name: string
  tenantId: number
}

export interface IITenantTreeItem {
  name: string
  id: number
  projects: IITenantTreeProjectItem[]
}

export interface IITenantTree {
  tenants: IITenantTreeItem[]
}

export interface IIApplicationTree {}

export interface ICreateSessionDto {}

export interface IIMetadataResponse {
  roles: string[]
  statuses: string[]
}

export interface IIGlobalDataResponse {
  items: string[]
  count: number
}

export interface IIGlobalPod {
  appName: string
  groupName: string
  projectName: string
  deployName: string
  podName: string
  podIP: string
  clusterId: string
  kind: string
  tenantId: number
}

export interface IIGlobalApplication {
  appName: string
  groupName: string
  projectName: string
  kind: string
  tenantName: string
  tenantId: number
}

export interface IIResourceResponse {
  pods: IIGlobalPod[]
  applications: IIGlobalApplication[]
}

export interface IPerformanceBodyDto {
  loadingDuration: number
}

export interface IIPath {
  pathName: string
  pathType: string
  serviceName: string
  servicePort: string
}

export interface IIngressHost {
  name: string
  paths: IIPath[]
}

export interface IIngressInfo {
  name: string
  hosts: IIngressHost[]
  annotations: string[]
}

export interface IIngressListResponseDto {
  ingresses: IIngressInfo[]
  totalCount: number
}

export interface IDomainRuleTarget {
  type: string
  service: string
}

export interface IDomainRule {
  path: string
  pathType: string
  target: IDomainRuleTarget
}

export interface IGetDomainResponseDto {
  name: string
  env: string
  cid: string
  clusterName: string
  updater: string
  updateTime: string
  pathTypeList: string[]
  rules: IDomainRule[]
  total: number
}

export interface IDomainGroupsDto {
  name: string
  cid: string[]
  env: string[]
}

export interface IGetDomainGroupsResponseDto {
  total: number
  domainGroups: IDomainGroupsDto[]
}

export interface IDomainDto {
  name: string
  cid: string
  env: string
  updater: string
  updateTime: string
}

export interface IGetDomainGroupResponseDto {
  name: string
  cid: string[]
  env: string[]
  cluster: string[]
  domain: IDomainDto[]
  total: number
}

export interface IIPort {}

export interface IISelector {
  key: string
  value: '@cid' | '@env' | '@domain_env_flag' | '@domain_cid_suffix'
}

export interface IICreateServicePlayLoad {
  prefix: string
  env: string[]
  cid: string[]
  cluster: string[]
  type: string
  externalName: string
  ports: IIPort[]
  selector: IISelector[]
  clusterIp: boolean
}

export interface IIUpdateServicePlayLoad {
  prefix: string
  env: string[]
  cid: string[]
  cluster: string
  type: string
  externalName: string
  ports: IIPort[]
  selector: IISelector[]
  clusterIp: boolean
}

export interface IGetInfoResponseDto {
  envs: string[]
  cids: string[]
  clusters: string[]
}

export interface IGetTemplateResponseDto {
  frontend?: string
  backend?: string
}

export interface IRenderTemplateBodyDto {
  envs: string[]
  cids: string[]
  clusters: string[]
  frontend?: string
  backend?: string
}

export interface IRenderTemplateResponseFrontend {}

export interface IRenderTemplateResponseDto {
  frontend: IRenderTemplateResponseFrontend
  backend: string[]
}

export interface IILog {
  operator: string
  group: string
  objectType: string
  method: string
  source: string
  time: string
  detail: string
}

export interface IIListLogsResponse {
  logs: IILog
  totalCount: number
  tenants: string[]
  methods: string[]
  objectTypes: string[]
  sources: string[]
}

export interface IRoleApplyTenantUserBodyDto {
  tenantId: number
  permissionGroupId: number
}

export interface IIApprover {
  userId: number
  name: string
  email: string
}

export interface IIApplyResponse {
  tenantName: string
  tenantId: number
  permissionGroupName: string
  permissionGroupId: number
  ticketId: string
  approverList: IIApprover[]
}

export interface IRoleApplyPlatformAdminBodyDto {
  purpose: string
  permissionGroupId: number
}

export interface IRoleApplyRequestBodyDto {
  tenantId: number
  permissionGroupId: number
  purpose: string
}

export interface IIChangeRoleApplyRequestBodyDto {
  roles: IRoleApplyRequestBodyDto[]
}

export interface IIChangeRoleApplyResponse {
  tickets: IIApplyResponse[]
}

export interface IIsRoleRequestPendingResponseDto {
  isRoleRequestPending: boolean
}

export interface IILatestNewUserTicket {
  approver: string
  status: string
  ticketId: string
}

export interface IIRoles {
  tenantId: number
  tenantName: string
  roleId: number
  roleName: string
}

export interface IIRoleBinding {
  totalCount: number
  roles: IIRoles[]
}

export interface IIRole {
  id: number
  name: string
}

export interface IITenantRole {
  tenantId: number
  tenantName: string
  roles: IIRole
}

export interface IITenantRoles {
  totalCount: number
  tenantsRoles: IITenantRole[]
}

export interface IIPlatformRoles {
  totalCount: number
  roles: IIRole[]
}

export interface IIApplicationDesc {
  tenantName: string
  tenantId: number
  name: string
  projectName: string
}

export interface IISearchTenantApplicationsResponse {
  totalCount: number
  tenantName: string
  tenantId: number
  applications: IIApplicationDesc[]
}

export interface IIProjectDesc {
  tenantName: string
  tenantId: number
  name: string
}

export interface IIGroupDirectoryGetProjectsResponse {
  totalCount: number
  tenantName: string
  tenantId: number
  projects: IIProjectDesc[]
}

export interface IITenantDesc {
  id: number
  name: string
  detail: string
  createAt: string
  updateAt: string
}

export interface IITenantDirectoryGetTenantsResponse {
  tenants: IITenantDesc[]
  totalSize: number
}

export interface IIGroupDirectoryGetDomainGroups {
  totalCount: number
  domainGroups: string[]
}

export interface IRequestListItem {
  group: string
  name: string
  email: string
  createtime: string
  status: string
  type: string
  role: string
  realGroup: string
  requireres: string
  approver: string
  reason: string
  updatetime: string
  id: string
}

export interface IRequestListResponseDto {
  totalCount: number
  items: IRequestListItem[]
}

export interface IIESTicket {
  id: string
  tenant: number
  type: string
  permissionGroup: number
  applicant: number
  status: string
  approver: number
  project: string
  purpose: string
  createdAt: string
  updatedAt: string
}

export interface IITicket {
  displayId?: string
  id: string
  tenant: IITenant
  type: string
  permissionGroup: {}
  applicant: {}
  status: string
  approver: {}
  project: string
  purpose: string
  createdAt: string
  updatedAt: string
}

export interface IIListTicketsResponse {
  tickets: IITicket[]
  totalCount: number
}

export interface IIMyTickets {
  tickets: IITicket[]
  totalCount: number
  pendingCount: number
  finishedCount: number
}

export interface IApplyTerminalAccessBody {
  reason: string
}

export interface IITicketDetail {
  type: string
  applicantName: string
  applicantId: number
  applicantEmail: string
  tenantName: string
  tenantId: number
  permissionGroupName: string
  permissionGroupId: number
  appliedTime: string
  status: string
  project: string
  purpose: string
  approvedTime: string
  cancelledTime: string
  approver: string
  approverList: IIApprover[]
}

export interface IIPostResponse {}

export interface IPipelineItem {
  id: string
  pipelineName: string
  project: string
  module: string
  env: string
  lastExecuteStatus: string
  lastExecutor: string
  lastExecuteId: string
  lastExecuteTime: string
  isFreezing: boolean
  engine: string
}

export interface IListPipelinesResponseDto {
  pipelines: IPipelineItem[]
  offset?: number
  limit?: number
  totalSize: number
}

export interface IPipelineConfig {
  pipelineTemplate: string
  gitRepo: string
  deployDefinition: string
  tenantName: string
  deployToK8s: boolean
  deployToK8sOnly: boolean
  k8sMesosZK: boolean
  k8sUseActualIDC: boolean
  k8sKeepSMBSmoke: boolean
  k8sReplicas: number
  k8sCanaryReplicas: number
  k8sMaxSurge: string
  k8sMaxUnavailable: string
  extraHosts: string
  k8sCanaryPercentage: string
  platformCluster: {}
  terminationGracePeriodSeconds: number
  detailConfig?: string
}

export interface IParameterDefinitionItem {
  name: string
  type: string
  value: {}
  description: string
  choices?: string[]
}

export interface ICreatePipelinesBodyDto {
  tenantName?: string
  project: string
  module: string
  engine?: string
  env?: string
  envs: string[]
  engines: {}
  pipelineConfig: IPipelineConfig
  parameterDefinitions: IParameterDefinitionItem[]
}

export interface IUpdatePipelinesBodyDto {
  tenantName?: string
  project: string
  module: string
  engine?: string
  env?: string
  envs: string[]
  engines: {}
  pipelineConfig: IPipelineConfig
  parameterDefinitions: IParameterDefinitionItem[]
}

export interface IParameterItem {
  name: string
  type: string
  value: {}
}

export interface IPipelineRunItem {
  id: string
  queueItemID: string
  status: string
  executor: string
  executeTime: string
  displayName: string
  parameters: IParameterItem[]
}

export interface IGetPipelineDetailResponseDto {
  name: string
  project: string
  module: string
  env: string
  isStdDeploy: boolean
  lastRun?: IPipelineRunItem
  parameterDefinitions: IParameterItem
  DetailConfig: string
  isCustom: string
}

export interface ICreatePipelineRunBodyDto {
  parameters: IParameterItem[]
}

export interface IStepItem {
  name: string
  status: string
  id: string
  durationMillis: number
  parameterDescription: string
}

export interface IStageItem {
  name: string
  status: string
  id: string
  durationMillis: number
  description: IStepItem[]
}

export interface IPipelineRunDetail {
  id: string
  status: string
  executor: string
  executeTime: string
  endTime: string
  duration: number
  displayName: string
  parameters: IParameterItem[]
  stages: IStageItem[]
  queueItemID: string
}

export interface IListPipelineRunsResponseDto {
  items: IPipelineRunDetail[]
  offset?: number
  limit?: number
  totalSize: number
}

export interface IPipelineRunResult {
  level: number
  msg: string
  tips: string
  type: string
}

export interface IPipelineRunLog {
  hasMore: boolean
  text: string
}

export interface IConfirmParameter {
  name: string
  value: string
}

export interface IConfirmPipelineRunBodyDto {
  inputId: string
  parameter: IConfirmParameter[]
  stepId: string
}

export interface IImportPipelinesBodyDto {
  project: string
  engine: string
  names: string[]
}

export interface IMovePipelineBodyDto {
  targetTenantId: number
}

export interface IPipelineEngine {
  name: string
  region: string
  type: string
}

export interface IBatchMigratePipelinesBodyDto {
  sourcePipelines: string[]
  destEngine: string
}

export interface IBatchMigratePipelineResponseDto {
  id: string
}

export interface IMigratePipelineBodyDto {
  destEngine: string
}

export interface IPipelineMigrationDetail {
  sourceEngine: string
  destEngine: string
  name: string
  project: string
  module: string
  status: string
  message: string
}

export interface IPipelineMigrationItem {
  failedCount: number
  migratingCount: number
  pendingCount: number
  succeededCount: number
  totalCount: number
  operator: string
  startedAt: string
  details: IPipelineMigrationDetail[]
  destEngine: string
  status: 'succeeded' | 'pending' | 'running' | 'failed'
  updatedAt: string
  cursor: number
}

export interface IReleaseFreezeItemDto {
  id: string
  env: string
  startTime: string
  endTime: string
  reason: string
  status: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  resource: string
}

export interface IGetLastReleaseFreezeResponseDto {
  isFreezing: boolean
  item?: IReleaseFreezeItemDto
}

export interface IListReleaseFreezesResponseDto {
  releaseFreezeList: IReleaseFreezeItemDto[]
  total: number
  message: string
  code: number
}

export interface ICreateReleaseFreezeBodyDto {
  envs: string[]
  startTime: number
  endTime: number
  reason: string
}

export interface IUpdateReleaseFreezeBodyDto {
  envs: string[]
  startTime: number
  endTime: number
  reason: string
}

export interface ICreatePprofRequest {
  env: string
  podName: string
  podIP: string
  port: number
  sampleTime: number
  object: string
  cluster: string
  namespace: string
  cpuLimist: number
  memoryLimit: number
}

export interface IPprof {
  profileId: string
  podName: string
  env: string
  operator: string
  status: string
  createdTime: string
  simpleTime: number
  object: string
  graphs: string[]
  profile: string
  message: string
}

export interface ICreatePprofResponse {
  code: number
  message: string
  data: IPprof
}

export interface IPprofListResponse {
  list: IPprof[]
  total: number
  size: number
  offset: number
}

export interface IGetPprofListResponse {
  code: number
  message: string
  data: IPprofListResponse
}

export interface IGetPprofResponse {
  code: number
  message: string
  data: IPprof
}

export interface IGetPprofObjectResponse {
  code: number
  message: string
  data: string[]
}

export interface ICreatePprofCronjobRequest {
  env: string
  podName: string
  podIP: string
  port: number
  sampleTime: number
  object: string
  cluster: string
  namespace: string
  cpuLimist: number
  memoryLimit: number
  scheduler: string
  enable: boolean
}

export interface ICreatePprofCronjobResponse {
  code: number
  message: string
}

export interface IGetPprofCronjobData {
  env: string
  port: number
  sampleTime: number
  object: string
  cluster: string
  cpuLimit: number
  memoryLimit: number
  enable: boolean
  scheduler: string
  deployName: string
}

export interface IGetPprofCronjobResponse {
  code: number
  message: string
  data: IGetPprofCronjobData
}

export interface ITemplateoverwrite {
  cid: string
  clusters: string[]
  type: string
}

export interface ITemplateConfig {
  type: string
  templateOverwriteList: ITemplateoverwrite[]
}

export interface IRollingUpdate {
  maxUnavailable: string
  maxSurge: string
}

export interface IStrategyOverwrite {
  cid: string
  clusters: string[]
  type: string
  rollingUpdate?: IRollingUpdate
}

export interface IStrategyConfig {
  type: string
  rollingUpdate?: IRollingUpdate
  strategyOverwrite: IStrategyOverwrite[]
}

export interface ICidAzs {
  cids: string[]
  azs: string[]
}

export interface IInstance {
  cluster: string
  podCount: number
  enableCanary: boolean
  canaryInitCount: number
}

export interface IDeployDetail {
  cid: string
  instances: IInstance[]
}

export interface IDeployAz {
  cidAzs: ICidAzs[]
  deployDetailList: IDeployDetail[]
}

export interface IResourceDesc {
  cpu: number
  gpu: number
  memory: number
}

export interface IResource {
  cids: string[]
  resourceDesc: IResourceDesc
}

export interface IResources {
  resource: IResourceDesc
  cidResourceList: IResource[]
}

export interface IDeployConfig {
  enable: boolean
  syncWithLeap: boolean
  template: ITemplateConfig
  strategy: IStrategyConfig
  deployAz: IDeployAz
  resources: IResources
  version: number
}

export interface IGetDeployConfigResponse {
  code: string
  message: string
  data: IDeployConfig
}

export interface IUpdateDeployConfigRequestBody {
  env: string
  template: ITemplateConfig
  strategy: IStrategyConfig
  deployAz: IDeployAz
  resources: IResources
  version: number
}

export interface IUpdateDeployConfigResponse {}
