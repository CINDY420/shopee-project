/* eslint-disable */

export interface IAddClusterBody {
  clusterId: string
  azV1: string
  monitoringUrl: string
  ecpVersion: string
  useOam?: boolean
  useQuota?: boolean
}

export interface IIQuota {
  used: number
  applied: number
  total: number
}

export interface IClusterDetail {
  displayName: string
  clusterId: string
  clusterType: string
  azv1Key: string
  azv2Key: string
  segmentKey: string
  segmentName?: string
  labels: string[]
  nodeCount: number
  podCount: number
  status: string
  healthyStatus: string
  healthGalioMsg: string
  healthKamardaMsg: string
  createTime: string
  observabilityLink: string
  metrics: { cpu?: IIQuota; memory?: IIQuota }
  karmadaCluster: boolean
}

export interface IClusterFilterOptions {
  type: string[]
  status: string[]
  healthyStatus: string[]
}

export interface IListClustersResponse {
  items: IClusterDetail[]
  filterOptions: IClusterFilterOptions
  totalCount: number
}

export interface IClusterMeta {
  descriptions?: string
  createTs?: string
  displayName?: string
  karmadaKubeConfig?: string
  segmentKey?: string
  azForDepconf?: string
  handleByGalio?: boolean
  ecpVersion?: string
  platform?: string
  uuid?: string
  clusterType?: string
  monitoringUrl?: string
  kubeApiserverType?: string
  azV1?: string
  azV2?: string
  regionKey?: string
  labels?: string[]
  kubeConfig?: string
}

export interface IListClusterMetasResponse {
  total: number
  items: IClusterMeta[]
}

export interface IGetClusterDetailResponse {
  displayName: string
  clusterId: string
  clusterType: string
  azv1Key: string
  azv2Key: string
  segmentKey: string
  segmentName?: string
  labels: string[]
  nodeCount: number
  podCount: number
  status: string
  healthyStatus: string
  healthGalioMsg: string
  healthKamardaMsg: string
  createTime: string
  observabilityLink: string
  metrics: { cpu?: IIQuota; memory?: IIQuota }
  karmadaCluster: boolean
}

export interface IEnableKarmadaBody {
  scheduler: string
  schedulerLease: string
}

export interface IEnableKarmadaResponse {}

export interface IETCDConfig {
  etcdIPs: string[]
  sslCA?: string
  sslCertificate?: string
  sslKey?: string
}

export interface IAddToEKSClusterBody {
  serviceName: string
  serviceId: number
  displayName: string
  azv2: string
  azv2Key: string
  segment: string
  segmentKey: string
  etcdConfig: IETCDConfig
  labels?: string[]
  description?: string
  kubeConfig: string
  env: string
  uuid: string
  deployedGalio: boolean
  monitoringName: string
}

export interface IListEnumsResponse {
  items: string[]
}

export interface ISegmentMeta {
  segmentKey: string
  segmentName: string
}

export interface IAzMeta {
  azName: string
  azKey: string
  complianceType?: string
  statefulness?: string
  labels: string[]
  region?: string
  segments: ISegmentMeta[]
}

export interface IListAllAzsResponse {
  items: IAzMeta[]
}

export interface ISegmentNameItem {
  name: string
  segmentKeys: string[]
}

export interface IListAllSegmentNamesResponse {
  items: ISegmentNameItem[]
}

export interface IAZSegment {
  azKey: string
  segmentKey: string
  name: string
}

export interface IListAzsSegmentsResponse {
  items: IAZSegment[]
}

export interface IListAllEnvsResponse {
  items: string[]
}

export interface IListAllCIDsResponse {
  items: string[]
}

export interface IAccessControlResponse {
  hasAccessPermission: boolean
}

export interface INodeLabel {
  key: string
  value: string
}

export interface INodeTaint {
  key: string
  value: string
  effect: string
}

export interface INodeDetailPodSummary {
  capacity: number
  count: number
}

export interface INodeDetailMetricsSpec {
  total: number
  used: number
}

export interface INodeDetailMetrics {
  cpu: INodeDetailMetricsSpec
  memory: INodeDetailMetricsSpec
  disk: INodeDetailMetricsSpec
  gpu: INodeDetailMetricsSpec
}

export interface INodeDetail {
  name: string
  privateIP: string
  status: string
  roles: string[]
  labels: INodeLabel[]
  taints: INodeTaint[]
  podSummary: INodeDetailPodSummary
  metrics: INodeDetailMetrics
}

export interface INodeStatusFilterOptions {
  option: string
  totalCount: number
}

export interface INodeFilterOptions {
  status: INodeStatusFilterOptions[]
  roles: string[]
}

export interface IListNodesResponse {
  items: INodeDetail[]
  filterOptions: INodeFilterOptions
  totalCount: number
}

export interface ISegmentDetail {
  azName: string
  azKey?: string
  segmentKey?: string
  segmentId: string
  name: string
  labels: string[]
  region?: string
  status: 'High' | 'Normal' | 'Low'
  property?: string
  type?: string
  cpu: IIQuota
  memory: IIQuota
  usedCPUPercentage: number
  appliedCPUPercentage: number
  usedMemoryPercentage: number
  appliedMemoryPercentage: number
}

export interface IListSegmentsResponse {
  items: ISegmentDetail[]
  total?: number
}

export interface IGetSegmentResponse {
  azName: string
  azKey?: string
  segmentKey?: string
  segmentId: string
  name: string
  labels: string[]
  region?: string
  status: 'High' | 'Normal' | 'Low'
  property?: string
  type?: string
  cpu: IIQuota
  memory: IIQuota
  usedCPUPercentage: number
  appliedCPUPercentage: number
  usedMemoryPercentage: number
  appliedMemoryPercentage: number
}

export interface ITenantManager {
  id: number
  email: string
  teamIds: number[]
}

export interface ITenant {
  name: string
  id: number
  managers?: ITenantManager[]
}

export interface IListTenantResponse {
  items: ITenant[]
}

export interface IListProjectsResponse {
  items: string[]
}

export interface IListApplicationsResponse {
  items: string[]
}

export interface IAZInfo {
  version?: string
  name?: string
  capability?: {}[]
  env?: string
  clusters?: string[]
}

export interface IFullAppClusterConfig {
  clusterUuid?: string
  cmdbTenantId?: string
  clusterName?: string
  scope?: string
  segmentKey?: string
  segment?: ISegmentDetail
  azKey?: string
  id?: string
  env?: string
  key?: string
  cid?: string
  az?: IAZInfo
}

export interface IListAppClusterConfigsResponse {
  total: number
  items: IFullAppClusterConfig[]
}

export interface IAppClusterConfig {
  env?: string
  azKey?: string
  segmentKey?: string
  clusterUuid?: string
  scope?: string
  key?: string
  cmdbTenantId?: string
}

export interface IAddAppClusterConfigsBody {
  configs: IAppClusterConfig[]
}

export interface IAddAppClusterConfigsResponse {
  ids: string[]
}

export interface IRemoveAppClusterConfigsBody {
  idList: string[]
}

export interface IEksClusterItem {
  az: string
  createdTime: string
  env: string
  healthyStatus: string
  uuid: string
  displayName: string
  nodeCount: number
  nodeId: number
  serviceName: string
  observabilityLink: string
  segment: string
  status: string
  id: number
}

export interface IEksListClustersResponse {
  items: IEksClusterItem[]
  total: number
  azList: string[]
  healthyStatusList: string[]
  servicesNameList: string[]
  statusList: string[]
  segmentList: string[]
}

export interface IGetAnchorServerResponse {
  address: string
}

export interface IEksGetClusterDetailResponse {
  healthyStatus: string
  clusterName: string
  status: string
  AZv2: string
  segment: string
  createTime: string
  kubeConfig: string
  env: string
  platformName: string
  nodeCount: number
}

export interface IEKSClusterResourceInfo {
  azName: string
  azKey: string
  segmentName: string
  segmentKey: string
  env: string
  templateId: number
  service: string[]
}

export interface IEKSClusterServerList {
  masterIPs: string[]
  workIPs?: string[]
}

export interface IEKSClusterSpec {
  clusterName: string
  platformName?: string
  platformId?: number
  kubernetesVersion: string
}

export interface IEKSClusterETCD {
  IPs?: string[]
  authority: string
  certification: string
  key: string
}

export interface IEKSClusterNetworkingModel {
  enableVpcCNI: boolean
  vpc?: string
  anchorServer?: string
}

export interface IEKSClusterNetwork {
  servicesCidrBlocks: string
  podCidrBlocks?: string
  nodeMask?: number
}

export interface IEKSClusterAdvance {
  enableDragonfly?: boolean
  enableGPU?: boolean
  apiServerExtraArgs?: string[]
  controllerManagementExtraArgs?: string[]
  schedulerExtraArgs?: string[]
  eventEtcd: IEKSClusterETCD
  enableLog?: boolean
  enableMonitoring?: boolean
  enableBromo?: boolean
}

export interface IEKSCreateClusterBody {
  resourceInfo: IEKSClusterResourceInfo
  serverList: IEKSClusterServerList
  clusterSpec: IEKSClusterSpec
  etcd: IEKSClusterETCD
  networkingModel: IEKSClusterNetworkingModel
  clusterNetwork: IEKSClusterNetwork
  advance: IEKSClusterAdvance
}

export interface IEKSCreateClusterResponse {
  id: number
  provisionJobId: number
}

export interface IGetClusterSummaryResponse {
  totalCount: number
  notReadyCount: number
  podCount: number
  readyCount: number
  unknownCount: number
}

export interface IGetClusterInfoByUuidResponse {
  healthyStatus: string
  clusterName: string
  status: string
  AZv2: string
  segment: string
  createTime: string
  kubeConfig: string
}

export interface ILabel {
  key?: string
  value?: string
}

export interface ITaint {
  effect?: string
  key?: string
  value?: string
}

export interface IEKsNodeMetricsSpec {
  allocatable?: number
  allocated?: number
  capacity?: number
}

export interface IEksNodeCondition {
  message: string
  meta: string
  reason: string
  severity: string
  status: string
  updateTime: string
}

export interface IEksNodeItem {
  nodeName: string
  privateIp: string
  status: string
  roles: string[]
  labels: ILabel[]
  taints: ITaint[]
  cpu: IEKsNodeMetricsSpec
  memory: IEKsNodeMetricsSpec
  disk: IEKsNodeMetricsSpec
  gpu: IEKsNodeMetricsSpec
  podSummary: IEKsNodeMetricsSpec
  nodeGroup: number
  nodeGroupName: string
  schedulingStatus: string
  condition: IEksNodeCondition[]
}

export interface IEksListNodesResponse {
  items: IEksNodeItem[]
  total: number
  rolesList: string[]
  allSchedulingStatus: string[]
}

export interface IEksCordonNodesBody {
  nodeNames: string[]
}

export interface IEksUnCordonNodesBody {
  nodeNames: string[]
}

export interface IEksDrainNodesBody {
  nodeNames: string[]
}

export interface IEksAddNodesBody {
  hostIPs: string[]
  nodeGroupId: number
}

export interface IINodegroupScaleNodeGroupResp {
  jobID?: number
}

export interface IEksDeleteNodesBody {
  hostIPs: string[]
  nodeGroupId: number
}

export interface INodeGroupItem {
  nodeGroupId: number
  nodeGroupName: string
}

export interface IEksGetNodeGroupListResponse {
  nodeGroups: INodeGroupItem[]
}

export interface IEksLabel {
  key: string
  value?: string
}

export interface IEksNodeLabel {
  labels: IEksLabel
  operator: string
}

export interface IEksSetNodesLabelsBody {
  labels: IEksNodeLabel[]
  nodes: string[]
}

export interface IEksTiant {
  effect: string
  key: string
  value?: string
}

export interface IEksNodeTaint {
  operator: string
  taints: IEksTiant
}

export interface IEksSetNodesTiantsBody {
  nodes: string[]
  taints: IEksNodeTaint[]
}

export interface IEksSegment {
  segmentKey: string
  segmentName: string
}

export interface IEksAZ {
  azKey: string
  azName: string
  segments: IEksSegment[]
}

export interface IEksListAllAzSegmentResponse {
  items: IEksAZ[]
}

export interface IEksListAllEnvsResponse {
  items: string[]
}

export interface IEksTemplate {
  id: number
  name: string
}

export interface IEksListAllTemplatesResponse {
  items: IEksTemplate[]
}

export interface IEksGetTemplateDetailResponse {
  clusterSpec: IEKSClusterSpec
  etcd: IEKSClusterETCD
  networkingModel: IEKSClusterNetworkingModel
  clusterNetwork: IEKSClusterNetwork
  advance: IEKSClusterAdvance
}

export interface IEksListAllSpaceTenantsResponse {
  items: string[]
}

export interface IEksSpaceTenantProduct {
  productId: number
  productName: string
}

export interface IEksListAllSpaceTenantProductsResponse {
  items: IEksSpaceTenantProduct[]
}

export interface IEksPlatform {
  id: number
  name: string
}

export interface IEksListAllPlatformsResponse {
  items: IEksPlatform[]
}

export interface IEksListAllKubernetesVersionsResponse {
  items: string[]
}

export interface IVpc {
  name: string
  isDefault: boolean
}

export interface IEksListAllVpcsResponse {
  items: IVpc[]
}

export interface IIJobSubJobStatus {
  status?: string
  type?: string
}

export interface IEksJobItem {
  jobId: number
  event: string
  status: string
  startTime: string
  updateTime: string
  condition: IIJobSubJobStatus[]
}

export interface IEksListJobsResponse {
  items: IEksJobItem[]
  total: number
}

export interface IPvLabel {
  key: string
  value: string
}

export interface IEksPvItem {
  pvName: string
  status: string
  volumeMode: string
  storage: string
  accessModes: string[]
  pvcName: string
  labels: IPvLabel[]
  createTime: string
}

export interface IEksListPvsResponse {
  items: IEksPvItem[]
  total: number
  statusList: string[]
  accessModeList: string[]
}

export interface IPvcLabel {
  key: string
  value: string
}

export interface IEksPvcItem {
  pvcName: string
  status: string
  storage: string
  accessModes: string[]
  pvName: string
  labels: IPvcLabel[]
  updateTime: string
}

export interface IEksListPvcResponse {
  items: IEksPvcItem[]
  total: number
  statusList: string[]
  accessModeList: string[]
}

export interface IEksGetPvcNamespaceResponse {
  namespaceList: string[]
}

export interface IEksSecret {
  secretName: string
  namespace: string
  type: string
  labels: string[]
  updateTime: string
}

export interface IListEksSecretsResponse {
  items: IEksSecret[]
  total: number
}

export interface IListAllNamespacesResponse {
  items: string[]
}

export interface IListAllTypesResponse {
  items: string[]
}

export interface IEksSecretDetail {
  secretKey: string
  secretValue: string
}

export interface IGetEksSecretResponse {
  secretName: string
  namespace: string
  type: string
  updateTime: string
  labels: string[]
  details: IEksSecretDetail[]
}

export interface IListEksSecretDetailResponse {
  items: IEksSecretDetail[]
  total: number
}
