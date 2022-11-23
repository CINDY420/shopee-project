export interface IScaleDeploymentTicketForm {
  deployment: string
  clusterId: string
  currentReleasePodCount: number
  targetReleasePodCount: number
  currentCanaryPodCount?: number
  targetCanaryPodCount?: number
  purpose: string
}

export interface IScaleDeploymentTicketExtraInfo {
  tenantId: string
  projectName: string
  appName: string
  appInstanceName: string
  canaryValid: boolean
  phase: string
}

export interface ICreateTicketBody {
  type: 'DEPLOYMENT_SCALE' | 'TERMINAL' | 'CHANGE_ROLE' | 'ADD_ROLE'
  title: string
  scaleDeploymentTicketForm: IScaleDeploymentTicketForm
  scaleDeploymentTicketExtraInfo: IScaleDeploymentTicketExtraInfo
}

export interface IElasticsearchTicketExtraInfo {
  ticketVersion: string
  tenantId: number
  tenantName: string
  project: string
  permissionGroupId: number
  permissionGroupName: string
}

export interface IShopeeScaleDeploymentTicketExtraInfoVariables {
  __STC_TICKET_TITLE: string
  auditResponse?: string
  deployment: string
  clusterId: string
  currentReleasePodCount: number
  targetReleasePodCount: number
  currentCanaryPodCount?: number
  targetCanaryPodCount?: number
  purpose: string
  tenantId: string
  projectName: string
  appName: string
  appInstanceName: string
  canaryValid: boolean
  phase: string
  runtimeReleasePodCount?: number
  runtimeCanaryPodCount?: number
  __STC_CREATE_STATUS: string
  __STC_TICKET_APP_NAME: string
  __STC_TICKET_GLOBAL_STATUS: string
  __STC_TICKET_SOURCE: string
  __STC_TICKET_VISIBLE: boolean
  __STC_TICKET_APP_ID: number
  __STC_TICKET_ID: string
  __STC_CREATOR_TEAM: string
  __STC_CREATOR: string
  _ACTIVITI_SKIP_EXPRESSION_ENABLED: boolean
  __STC_TICKET_STATUS: string
  __STC_TICKET_TYPE: string
}

export interface IShopeeScaleDeploymentTicketExtraInfo {
  variables: IShopeeScaleDeploymentTicketExtraInfoVariables
  ticketVersion: string
  taskId?: string
  title: string
  hoursFromCreation: number
}

export interface ITicketMetaInfo {
  ticketId: string
  displayId: string
  ticketType: 'DEPLOYMENT_SCALE' | 'TERMINAL' | 'CHANGE_ROLE' | 'ADD_ROLE'
  status: 'OPEN' | 'CLOSED'
  stage: 'Pending' | 'Canceled' | 'Rejected' | 'Approved'
  purpose: string
  approverList: string[]
  assigneeList: string[]
  updateTime: string
  createTime: string
  applicantEmail: string
  applicantId: number
  applicantName: string
}

export interface ICreateTicketResponse {
  extraInfo: IElasticsearchTicketExtraInfo | IShopeeScaleDeploymentTicketExtraInfo
  metaInfo: ITicketMetaInfo
}

export interface IGetTicketResponse {
  extraInfo: IElasticsearchTicketExtraInfo | IShopeeScaleDeploymentTicketExtraInfo
  metaInfo: ITicketMetaInfo
}

export interface IScaleDeploymentTicketFormWithAuditResponse {
  auditResponse?: string
  deployment?: string
  clusterId?: string
  currentReleasePodCount?: number
  targetReleasePodCount?: number
  currentCanaryPodCount?: number
  targetCanaryPodCount?: number
  purpose?: string
}

export interface IUpdateTicketFormBody {
  form: IScaleDeploymentTicketFormWithAuditResponse
}

export interface ITicket {
  extraInfo: IElasticsearchTicketExtraInfo | IShopeeScaleDeploymentTicketExtraInfo
  metaInfo: ITicketMetaInfo
}

export interface IGetTicketsResponse {
  total: number
  items: ITicket[]
}

export interface IUpdateTasksBody {
  action: 'approval' | 'reject'
}

export interface IUpdateDeployConfigBodyDto {
  env: string
  comment: string
  version: string
  deployConfig: string
}

export interface IResource {
  cpu: number
  disk: number
  mem: number
  gpu: number
}

export interface IComponentType {
  workload_type: string
}

export interface IComponentTypeOverride {
  cid: string
  data: IComponentType
  idc: string
}

export interface IDeployConfigZone {
  cid: string
  az: string
  zone_name: string
}

export interface IEnv {
  cid: string
  data: {
    key?: string
    value?: string
  }
}

export interface IIClusterInstance {
  canary_init_count: number
  cid: string
  idc: string
}

export interface IResourceOverride {
  cid: string
  data: {
    cpu?: number
    mem?: number
    disk?: number
    gpu?: number
  }
}

export interface IMaxPerUniqueKey {
  unique_key: string
  max_instances: number
}

export interface ISelector {
  key: string
  operator: string
  value?: string
  values?: string[]
}

export interface IAgentSelectors {
  selectors: ISelector[]
}

export interface IAssignmentPolice {
  parameters: IAgentSelectors | IMaxPerUniqueKey
  name: string
}

export interface IScheduler {
  orchestrator: {}
  assignment_policies: IAssignmentPolice[]
}

export interface IStrategy {
  name: string
  parameters: {
    instances_per_agent?: number
    threshold?: number
    step_down?: number
    in_place?: boolean
    strict_in_place?: boolean
    reserve_resources?: boolean
    disable_restart?: boolean
    enable_canary_replacement?: boolean
    canary_stages?: string[]
    max_surge?: string
    max_unavailable?: string
  }
}

export interface IStrategyOverride {
  cid: string
  data: {
    name?: string
    parameters?: {
      max_surge?: string
      max_unavailable?: string
    }
  }
  idc: string
}

export interface IDeployConfig {
  annotations: {}
  idcs: {}
  instances: {}
  minimum_instances: {}
  resources: {}
  component_type: IComponentType[]
  component_type_overrides: IComponentTypeOverride[]
  deploy_zones: IDeployConfigZone[]
  envs: IEnv[]
  cluster_instance: IIClusterInstance[]
  resources_override: IResourceOverride[]
  scheduler: IScheduler
  strategy: IStrategy
  k8s_strategy: IStrategy
  jenkins_config: string
  strategy_override: IStrategyOverride[]
}

export interface IGetDeployConfigResponse {
  enable: boolean
  comment: string
  createAt: string
  version: string
  deployConfig: IDeployConfig
}

export interface IAvailableZone {
  name: string
  type: string
  clusters: string[]
}

export interface IListAvailableZonesResponse {
  availableZones: IAvailableZone[]
  total: number
}

export interface IComponent {
  name: string
  nameDisplay: string
  type: string
  category: string
}

export interface IComponents {
  env: string
  idc: string
  components: IComponent[]
}

export interface IListComponentResponse {
  components: {}
}

export interface IListExtraConfigsResponse {
  extraConfigs: string[]
  total: number
}

export interface IListDeployConfigEnvsResponse {
  envs: string[]
  total: number
}

export interface IListAzsResponse {
  availableZones: string[]
  total: number
}

export interface IListEnvsResponse {
  envs: string[]
  total: number
}

export interface IListCidsResponse {
  cids: string[]
  total: number
}

export interface IListClustersResponse {
  clusters: string[]
  total: number
}

export interface IListSegmentsResponse {
  segments: string[]
  total: number
}

export interface IListMachineModelsResponse {
  machineModels: string[]
  total: number
}

export interface IBigSale {
  bigSaleId: string
  day: number
  month: number
  name: string
  year: number
}

export interface IListBigSalesResponse {
  bigSales: IBigSale[]
  total: number
}

export interface ILabelNode {
  depth: number
  displayName: string
  labelNodeId: string
  parentId: string
  childNodes: ILabelNode[]
}

export interface ILabel {
  labelNodeId: string
  displayName: string
}

export interface IListLabelsResponse {
  labels: ILabel[]
  total: number
}

export interface IIncrementMetaData {
  id: string
  level1: string
  level2: string
  level3: string
  version: string
}

export interface IIncrementBasicInfo {
  cid: string
  displayEnv: string
  az: string
  cluster: string
  segment: string
}

export interface IIncrementEstimated {
  cpuLimitOneInsPeak: number
  estimatedCpuIncrement: number
  estimatedCpuIncrementTotal: number
  estimatedInsCountTotal: number
  estimatedLogic: string
  estimatedMemIncrement: number
  estimatedMemIncrementTotal: number
  estimatedGpuCardIncrement: number
  estimatedQpsTotal: number
  evaluationMetrics: 'CPU' | 'MEM' | 'QPS'
  gpuCardLimitOneInsPeak: number
  machineModel: string
  memLimitOneInsPeak: number
  minInsCount: number
  qpsMaxOneIns: number
  remark: string
}

export interface IFrontEndIncrement {
  metaData: IIncrementMetaData
  data: {
    basicInfo?: IIncrementBasicInfo
    estimated?: IIncrementEstimated
  }
}

export interface IListIncrementResponse {
  data: IFrontEndIncrement[]
  total: number
}

export interface IDeleteIncrementEstimateBody {
  ids: string[]
}

export interface ICreateIncrementEstimate {
  az: string
  cid: string
  cluster?: string
  cpuLimitOneInsPeak: number
  displayEnv: string
  estimatedCpuIncrementTotal?: number
  estimatedLogic: string
  estimatedMemIncrementTotal?: number
  estimatedQpsTotal?: number
  evaluationMetrics: 'CPU' | 'MEM' | 'QPS'
  gpuCardLimitOneInsPeak: number
  level1: string
  level2: string
  level3?: string
  machineModel: string
  memLimitOneInsPeak: number
  minInsCount: number
  qpsMaxOneIns?: number
  remark?: string
  segment: string
}

export interface ICreateIncrementEstimateBody {
  data: ICreateIncrementEstimate[]
}

export interface IEditIncrementEstimate {
  az?: string
  cid?: string
  cluster?: string
  cpuLimitOneInsPeak?: number
  displayEnv?: string
  estimatedCpuIncrementTotal?: number
  estimatedLogic?: string
  estimatedMemIncrementTotal?: number
  estimatedQpsTotal?: number
  evaluationMetrics?: 'CPU' | 'MEM' | 'QPS'
  gpuCardLimitOneInsPeak?: number
  machineModel?: string
  memLimitOneInsPeak?: number
  minInsCount?: number
  qpsMaxOneIns?: number
  remark?: string
  segment?: string
}

export interface IEditIncrementEstimateBody {
  ids: string[]
  isBatch?: boolean
  data: IEditIncrementEstimate
}

export interface IStockMetaData {
  id: string
  sdu: string
  level1: string
  level2: string
  level3: string
  version: string
  editStatus: number
}

export interface IStockBasicInfo {
  cid: string
  displayEnv: string
  az: string
  cluster: string
  segment: string
}

export interface IStockReference {
  insCountPeak: number
  cpuReqOneInsPeak: number
  memLimitOneInsPeak: number
  gpuCardLimitOneInsPeak: number
  cpuLimitOneInsPeak: number
  memUsedOneInsPeak: number
  cpuAllocatedTotalPeak: number
  memAllocatedTotalPeak: number
  gpuCardAllocatedTotalPeak: number
  cpuUsedOneInsPeak: number
  memReqOneInsPeak: number
  cpuUsedTotalPeak: number
  memUsedTotalPeak: number
}

export interface IStockGrowthExpectation {
  qpsTotalPeak: number
  qpsMaxOneIns: number
  inUse: number
  evaluationMetrics: 'CPU' | 'MEM' | 'QPS'
  growthRatio: number
  growthRatioAnnotation: string
  minInsCount: number
  safetyThreshold: string
  remark: string
  machineModel: string
}

export interface IStockEstimated {
  estimatedCpuIncrement: number
  estimatedGpuCardIncrement: number
  estimatedInsCountIncrement: number
  estimatedInsCountTotal: number
  estimatedMemIncrement: number
}

export interface IFrontEndStock {
  metaData: IStockMetaData
  data: {
    basicInfo?: IStockBasicInfo
    reference?: IStockReference
    growthExpectation?: IStockGrowthExpectation
    estimated?: IStockEstimated
  }
}

export interface IListStockResponse {
  data: IFrontEndStock[]
  total: number
}

export interface IEditStockResource {
  displayEnv?: string
  evaluationMetrics?: 'CPU' | 'MEM' | 'QPS'
  gpuCardLimitOneInsPeak?: number
  growthRatio?: number
  growthRatioAnnotation?: string
  inUse?: number
  machineModel?: string
  minInsCount?: number
  qpsMaxOneIns?: number
  qpsTotalPeak?: number
  remark?: string
  safetyThreshold?: number
}

export interface IEditStockResourceBody {
  sduClusterIds: string[]
  isBatch?: boolean
  data: IEditStockResource
}

export interface ISummaryData {
  az: string
  cid: string
  cluster: string
  cpuIncrement: number
  cpuIncrementRatio: number
  cpuStock: number
  cpuTarget: number
  displayEnv: string
  gpuIncrement: number
  gpuIncrementRatio: number
  gpuStock: number
  gpuTarget: number
  insCountIncrement: number
  insCountIncrementRatio: number
  insCountStock: number
  insCountTarget: number
  level1DisplayName: string
  level2DisplayName: string
  level3DisplayName: string
  machineModel: string
  memIncrementRatio: number
  memStock: number
  memIncrement: number
  memTarget: number
  versionId: string
  versionName: string
}

export interface IListSummaryResponse {
  summaries: ISummaryData[]
  total: number
}

export interface IVersion {
  endBigSale: IBigSale
  startBigSale: IBigSale
  versionId: string
  state: number
  name: string
}

export interface IListVersionResponse {
  versions: IVersion[]
  total: number
}

export interface ICreateVersionBody {
  endBigSaleId: string
  startBigSaleId: string
  name: string
  state: number
}

export interface IEditVersionBody {
  unlockVersionId?: string
  lockAll: boolean
}

export interface IProject {
  cids: string[]
  clusters: string[]
  envs: string[]
  name: string
  tenant: string
}

export interface IListProjectResponse {
  totalCount: number
  tenantId: number
  projects: IProject[]
}

export interface IQuota {
  cpuTotal: number
  memoryTotal: number
  name: string
}

export interface ICreateProjectBody {
  project: string
  cids: string[]
  envs: string[]
  orchestrators: string[]
  quotas?: IQuota[]
}

export interface IMoveProjectBody {
  targetTenant: string
}

export interface IGetProjectCids {
  cid: string
  clusterIds: string[]
}

export interface IGetProjectClusters {
  cids: IGetProjectCids[]
  environment: string
}

export interface IProjectQuota {
  used: number
  assigned: number
  total: number
  limit: number
}

export interface IGetProjectQuotaDetail {
  name: string
  envName: string
  cpu: IProjectQuota
  memory: IProjectQuota
}

export interface IGetProjectQuota {
  name: string
  resourceQuotas: IGetProjectQuotaDetail[]
}

export interface IGetProjectQuotas {
  clusters: IGetProjectQuota[]
}

export interface IGetProjectResponse {
  envClusterMap: {}
  cids: string[]
  clusters: IGetProjectClusters[]
  envs: string[]
  tenantName: string
  tenantId: number
  name: string
  quotas: IGetProjectQuotas
  simpleClusters: string[]
}

export interface IApplication {
  name: string
  status: string
  cids: string[]
  environments: string[]
}

export interface IListApplicationsResponse {
  apps: IApplication[]
  tenantName: string
  tenantId: number
  projectName: string
  totalCount: number
}

export interface IGetApplicationResponse {
  name: string
  tenantName: string
  tenantId: string
  projectName: string
  cids: string[]
  envs: string[]
  azs: string[]
  enableHpa: boolean
}

export interface IGetApplicationServiceNameResponse {
  serviceName: string
}

export interface IContainer {
  image: string
  name: string
  tag: string
  phase: string
}

export interface ISduAZ {
  name: string
  type: 'kubernetes' | 'bromo'
  env: string
  cid: string
  cluster?: string
  componentType: string
  componentTypeDisplay: string
  instance: number
  status: string
  healthy: 'healthy' | 'unhealthy'
  unhealthyCount: number
  phase: string
  tag: string
  updateTime: string
  releaseCount: number
  canaryCount: number
  clusterId: string
  canScale: boolean
  canRollback: boolean
  canFullRelease: boolean
  canRestart: boolean
  canDelete: boolean
  containers: IContainer[]
  appInstanceName: string
  monitoringClusterName: string
}

export interface ISdu {
  name: string
  azs: ISduAZ[]
  instancesCount: number
}

export interface IListSdusResponse {
  items: ISdu[]
  allComponentTypeDisplays: string[]
}

export interface ISduItem {
  sduName: string
  hasHpa: boolean
}

export interface IAzSdu {
  azName: string
  sdus: ISduItem[]
}

export interface IListAllAzSdusResponse {
  items: IAzSdu[]
}

export interface IGetSduAzsResponse {
  sdu: ISdu
}

export interface IUsage {
  used: number
  applied: number
  ready: boolean
  alarm: string
  total: number
}

export interface ITask {
  id: string
  address: string
  host: string
  containerId: string
  deploymentId: string
  status: string
  health: string
  cpu: IUsage
  memory: IUsage
  createTime: string
}

export interface IListTasksResponse {
  totalCount: number
  items: ITask[]
  statusList: string[]
}

export interface IDeploymentHistory {
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
  healthy: 'healthy' | 'unhealthy'
  pendingReason: string
}

export interface IListDeploymentHistoryResponse {
  totalCount: number
  items: IDeploymentHistory[]
  statusList: string[]
}

export interface IAz {
  name: string
  type: string
  env: string
  clusters: string[]
}

export interface IGetDeploymentResponse {
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
  updateTime: string
  scalable: boolean
  rollbackable: boolean
  fullreleaseable: boolean
  restartable: boolean
  appInstanceName: string
  monitoringClusterName: string
  componentType: string
  componentTypeDisplay: string
  containers: IContainer[]
  az: IAz
  zoneName: string
}

export interface IDirectoryProject {
  tenantId: number
  name: string
}

export interface IListDirectoryProjectsResponse {
  totalCount: number
  tenantId: number
  projects: IDirectoryProject[]
}

export interface IDirectoryApplication {
  tenantId: number
  tenantName: string
  projectName: string
  name: string
}

export interface IListDirectoryApplicationsResponse {
  totalCount: number
  tenantId: number
  applications: IDirectoryApplication[]
}

export interface IHpaMeta {
  az: string
  sdu: string
}

export interface IHpaAutoscalingRule {
  metrics: 'averageCpu' | 'averageMemory' | 'instantCpu' | 'instantMemory'
  threshold: number
}

export interface IHpaCronRule {
  repeatType: 'Once' | 'Daily' | 'Weekly'
  startTime: string
  endTime: string
  targetCount: number
  startWeekday?: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  endWeekday?: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
}

export interface IHpaRules {
  autoscalingRules: IHpaAutoscalingRule[]
  cronRules: IHpaCronRule[]
}

export interface IHpaSpecScalePolicy {
  type: 'Percent' | 'Pods'
  value: number
  periodSeconds: number
}

export interface IHpaSpecScale {
  stabilizationWindowSeconds?: number
  notifyFailed?: boolean
  selected?: boolean
  policies?: IHpaSpecScalePolicy[]
  selectPolicy?: 'Max' | 'Min'
}

export interface IHpaSpecScaleDirection {
  scaleUp?: IHpaSpecScale
  scaleDown?: IHpaSpecScale
}

export interface IHpaThreshold {
  maxReplicaCount: number
  minReplicaCount: number
}

export interface IHpaSpec {
  notifyChannels: string[]
  autoscalingLogic: 'or' | 'and'
  rules: IHpaRules
  scaleDirection: IHpaSpecScaleDirection
  threshold: IHpaThreshold
  status: boolean
  updator?: string
  updatedTime?: string
}

export interface ICreateHpaBody {
  meta: IHpaMeta
  spec: IHpaSpec
}

export interface IUpdateHpaBody {
  meta: IHpaMeta
  spec: IHpaSpec
  id: number
}

export interface IHPAWithId {
  id: number
  meta: IHpaMeta
  spec: IHpaSpec
}

export interface IBatchEditHPARulesBody {
  hpas: IHPAWithId[]
}

export interface IListHPARulesResponse {
  lists: IHPAWithId[]
  total: number
}

export interface IGetHpaDetailResponse {
  id: number
  meta: IHpaMeta
  spec: IHpaSpec
}

export interface IDeploymentHpa {
  meta: IHpaMeta
  spec: IHpaSpec
}

export interface IBatchCopyHpaBody {
  deploymentsHpas: IDeploymentHpa[]
}

export interface IBatchCopyHpaResponse {
  azSdu: IHpaMeta
  errorMessage: string
}

export interface IGetHpaDefaultConfigResponse {
  notifyChannels: string[]
  autoscalingLogic: 'or' | 'and'
  rules: IHpaRules
  scaleDirection: IHpaSpecScaleDirection
  threshold: IHpaThreshold
  status: boolean
  updator?: string
  updatedTime?: string
}

export interface IZone {
  zoneName: string
  az: string
  description: string
}

export interface IListZoneResponse {
  zones: IZone[]
  total: number
}

export interface IListAllZoneResponse {
  zones: IZone[]
}

export interface ICreateZoneBody {
  namePrefix: string
  azs: string[]
  description: string
}

export interface IAZ {
  name: string
  type: 'kubernetes' | 'bromo' | 'ecp'
  env: string
  clusters: string[]
}

export interface IListEnableZoneAZsResponse {
  azs: IAZ[]
}

export interface IListAZsResponse {
  azs: IAZ[]
  total: number
}

export interface IListAnnouncementsResponse {
  announcements: string[]
  total: number
}

export interface IListOfflineTenantsResponse {
  tenants: number[]
  total: number
}

export interface IListEnableHybridDeployTenantsResponse {
  tenants: string[]
  total: number
}

export interface IGetGlobalHpaResponse {
  hpaStatus: boolean
}

export interface IUpdateGlobalHpaBody {
  hpaStatus: boolean
}
