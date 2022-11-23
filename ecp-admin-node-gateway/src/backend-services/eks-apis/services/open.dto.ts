/* eslint-disable */

export class IClusterAddClusterReq {
  az: string
  az_key: string
  description?: string
  env: string
  etcd_config?: IModelETCDConfig
  galio_disable?: boolean
  kubeconfig?: string
  kubeconfig_byte?: string
  labels?: string[]
  monitoring_label_name?: string
  name?: string
  segment: string
  segment_key: string
  space_node_id?: number
  space_node_name: string
  uuid?: string
}

export class IClusterBrief {
  az: string
  az_key: string
  created_at?: string
  deleted_at?: IGormDeletedAt
  env: string
  healthy_condition?: IModelCondition[]
  healthy_status?: string
  id?: number
  name?: string
  node_count?: number
  observability_link?: string
  pod_count?: number
  segment: string
  segment_key: string
  space_node_id?: number
  space_node_name: string
  status?: string
  updated_at?: string
  uuid?: string
}

export class IClusterCreateClusterReq {
  az: string
  az_key: string
  cluster_config?: IModelClusterConfig
  cluster_name: string
  env: string
  master_list: string[]
  platform_id?: number
  platform_name?: string
  segment: string
  segment_key: string
  space_node_id?: number
  space_node_name: string
  template_id?: number
  worker_config?: IModelWorkerConfig
  worker_list: string[]
  worker_template_id?: number
}

export class IClusterCreateClusterResp {
  id?: number
  provision_job_id?: number
}

export class IClusterDetail {
  cluster?: IModelCluster
}

export class IClusterGetK8sVersionResponse {
  versions?: string[]
}

export class IClusterListClusterResponse {
  all_count?: number
  items?: IClusterBrief[]
  total?: number
}

export class IClusterListClusterSelectorsResponse {
  az?: string[]
  healthy_status?: string[]
  segment?: string[]
  space_node_name?: string[]
  status?: string[]
}

export class IClustermanagerCommonLabel {
  key?: string
  value?: string
}

export class IClustermanagerCommonResouce {
  allocatable?: number
  allocated?: number
  capacity?: number
}

export class IClustermanagerCommonTaint {
  effect?: string
  key?: string
  value?: string
}

export class IClustermanagerOperateLabels {
  labels?: IClustermanagerCommonLabel
  operator?: string
}

export class IClustermanagerOperateTaints {
  operator?: string
  taints?: IClustermanagerCommonTaint
}

export class IClustermanagerStatusSummary {
  not_ready_count?: number
  ready_count?: number
  total?: number
  unknown_count?: number
}

export class ICoreErrResponse {
  code?: number
  message?: string
  trace?: {}
}

export class IGormDeletedAt {
  time?: string
  valid?: boolean
}

export class IJobBrief {
  created_at?: string
  deleted_at?: IGormDeletedAt
  id?: number
  name?: string
  status?: string
  sub_job_status?: IJobSubJobStatus[]
  updated_at?: string
}

export class IJobDetail {
  created_at?: string
  deleted_at?: IGormDeletedAt
  id?: number
  name?: string
  stages?: IModelStage[]
  status?: string
  sub_job_status?: IJobSubJobStatus[]
  updated_at?: string
}

export class IJobListJobResponse {
  items?: IJobBrief[]
  total?: number
}

export class IJobRerunJobReq {
  job_id?: number
}

export class IJobSubJobStatus {
  status?: string
  type?: string
}

export class IMetaGetAnchorServerResponse {
  address?: string
}

export class IMetaListAZResponse {
  az_list?: ISpaceAZV2[]
}

export class IMetaListEnvResponse {
  env_list?: string[]
}

export class IMetaListPlatformsResponse {
  platforms?: ITocPlatform[]
}

export class IMetaListProductsResponse {
  products?: IModelAuth[]
}

export class IMetaListTenantsResponse {
  tenants?: string[]
}

export class IMetaListVPCResponse {
  vpcs?: ISpaceVPC[]
}

export class IModelAddonConfig {
  enable_bromo?: boolean
  enable_log?: boolean
  enable_monitor?: boolean
}

export class IModelAuth {
  space_node_id?: number
  space_node_name: string
}

export class IModelBaseModel {
  created_at?: string
  deleted_at?: IGormDeletedAt
  id?: number
  updated_at?: string
}

export class IModelCluster {
  az: string
  az_key: string
  cluster_config?: IModelClusterConfig
  cluster_runtime_info?: IModelClusterRuntimeInfo
  control_plane_group?: number[]
  created_at?: string
  deleted_at?: IGormDeletedAt
  description?: string
  env: string
  galio_disabled?: boolean
  id?: number
  kube_config?: string
  labels?: string[]
  name?: string
  platform_id?: number
  platform_name?: string
  segment: string
  segment_key: string
  space_node_id?: number
  space_node_name: string
  template_id?: number
  updated_at?: string
  uuid?: string
  worker_node_group?: number[]
}

export class IModelClusterConfig {
  addon_config?: IModelAddonConfig
  control_plane_args?: IModelControlPlaneExtArgs
  etcd_config?: IModelETCDConfig
  event_etcd_config?: IModelETCDConfig
  event_separate?: boolean
  network_config?: IModelNetworkConfig
  version: string
}

export class IModelClusterRuntimeInfo {
  healthy_condition?: IModelCondition[]
  healthy_status?: string
  node_count?: number
  observability_link?: string
  pod_count?: number
  status?: string
}

export class IModelClusterTemplate {
  cluster_config?: IModelClusterConfig
  created_at?: string
  deleted_at?: IGormDeletedAt
  id?: number
  name?: string
  space_node_id?: number
  space_node_name: string
  updated_at?: string
}

export class IModelCondition {
  message?: string
  meta?: string
  reason?: string
  severity?: string
  status?: string
  update_time?: string
}

export class IModelControlPlaneExtArgs {
  api_server_extra_args?: string[]
  controller_extra_args?: string[]
  scheduler_extra_args?: string[]
}

export class IModelETCDConfig {
  ca?: string
  cert?: string
  etcd_type?: string
  etcd_uuid?: string
  key?: string
  member?: string[]
}

export class IModelFeatures {
  dragonfly?: boolean
  gpu?: boolean
  register_dns?: boolean
  register_zk?: boolean
}

export class IModelNetworkConfig {
  node_mask_size?: number
  pod_cidr?: string
  sdn_config?: IModelSDNConfig
  sdn_enable?: boolean
  services_cidr?: string
}

export class IModelSDNConfig {
  anchor_server?: string
  vpc_id?: string
}

export class IModelStage {
  message?: string
  meta?: string
  status?: string
  update_time?: string
}

export class IModelWorkerConfig {
  features?: IModelFeatures
  kubelet_extra_args?: string[]
  kubelet_version?: string
}

export class IModelWorkerTemplate {
  created_at?: string
  deleted_at?: IGormDeletedAt
  features?: IModelFeatures
  id?: number
  kubelet_extra_args?: string[]
  kubelet_version?: string
  name?: string
  space_node_id?: number
  space_node_name: string
  updated_at?: string
}

export class INodeCordonReq {
  nodes_names?: string[]
}

export class INodeDrainReq {
  nodes_names?: string[]
}

export class INodeOperateNodeLabelsReq {
  node_labels?: IClustermanagerOperateLabels[]
  nodes_name?: string[]
}

export class INodeOperateNodeTaintsReq {
  nodes_name?: string[]
  taints?: IClustermanagerOperateTaints[]
}

export class INodeUncordonReq {
  nodes_names?: string[]
}

export class INodegroupBaseInfo {
  id?: number
  uuid?: string
}

export class INodegroupListNodeGroupResp {
  data?: INodegroupBaseInfo[]
}

export class INodegroupScaleNodeGroupReq {
  host_ips?: string[]
  node_group_id: number
}

export class INodegroupScaleNodeGroupResp {
  jobID?: number
}

export class IResponseClusterNode {
  condition?: IModelCondition[]
  cpu?: IClustermanagerCommonResouce
  disk?: IClustermanagerCommonResouce
  gpu?: IClustermanagerCommonResouce
  labels?: IClustermanagerCommonLabel[]
  memory?: IClustermanagerCommonResouce
  name?: string
  node_group?: number
  node_group_name?: string
  pod_summary?: IClustermanagerCommonResouce
  private_ip?: string
  roles?: string[]
  scheduling_status?: string
  status?: string
  taints?: IClustermanagerCommonTaint[]
}

export class IResponseGetClusterSummaryResponse {
  pod_count?: number
  roles?: string[]
  summary?: IClustermanagerStatusSummary
}

export class IResponseGetSecretDetail {
  creationtimestamp?: string
  items?: IResponseSecretDetail[]
  labels?: { [key: string]: string }
  namespace?: string
  secretname?: string
  total?: number
  type?: string
}

export class IResponseListNodesResponse {
  all_scheduling_status?: string[]
  code?: number
  message?: string
  nodes?: IResponseClusterNode[]
  roles?: string[]
  summary?: IClustermanagerStatusSummary
  total?: number
  trace?: {}
}

export class IResponseListPVAccessModesResponse {
  items?: string[]
}

export class IResponseListPVCAccessModesResponse {
  items?: string[]
}

export class IResponseListPVCNamespacesResponse {
  items?: string[]
}

export class IResponseListPVCStatusResponse {
  items?: string[]
}

export class IResponseListPVCsResponse {
  code?: number
  items?: IResponsePVC[]
  message?: string
  total?: number
  trace?: {}
}

export class IResponseListPVStatusResponse {
  items?: string[]
}

export class IResponseListPVsResponse {
  code?: number
  items?: IResponsePV[]
  message?: string
  total?: number
  trace?: {}
}

export class IResponseListSecretsNamespacesResponse {
  items?: string[]
}

export class IResponseListSecretsResponse {
  code?: number
  items?: IResponseSecret[]
  message?: string
  total?: number
  trace?: {}
}

export class IResponseListSecretsTypesResponse {
  items?: string[]
}

export class IResponsePV {
  accessmodes?: string[]
  creationtimestamp?: string
  labels?: { [key: string]: string }
  pvcname?: string
  pvname?: string
  status?: string
  storage?: string
  volumemode?: string
}

export class IResponsePVC {
  accessmodes?: string[]
  creationtimestamp?: string
  labels?: { [key: string]: string }
  namespace?: string
  pvcname?: string
  pvname?: string
  status?: string
  storage?: string
}

export class IResponseSecret {
  creationtimestamp?: string
  labels?: { [key: string]: string }
  namespace?: string
  secretname?: string
  type?: string
}

export class IResponseSecretDetail {
  secretkey?: string
  secretvalue?: string
}

export class ISpaceAZV2 {
  az_key?: string
  az_name?: string
  segments?: ISpaceSegment[]
  status?: string
}

export class ISpaceSegment {
  segment_key?: string
  segment_name?: string
}

export class ISpaceVPC {
  is_default?: boolean
  name?: string
}

export class ITemplateBrief {
  created_at?: string
  deleted_at?: IGormDeletedAt
  id?: number
  name?: string
  updated_at?: string
}

export class ITemplateClusterTemplateDetail {
  cluster_template?: IModelClusterTemplate
}

export class ITemplateCreateClusterTemplateReq {
  cluster_config?: IModelClusterConfig
  name?: string
  space_node_id?: number
  space_node_name: string
}

export class ITemplateCreateTemplateResp {
  id?: number
}

export class ITemplateCreateWorkerTemplateReq {
  name?: string
  space_node_id?: number
  space_node_name: string
  worker_config?: IModelWorkerConfig
}

export class ITemplateListClusterTemplateResponse {
  items?: ITemplateBrief[]
  total?: number
}

export class ITemplateWorkerTemplateDetail {
  worker_template?: IModelWorkerTemplate
}

export class ITocPlatform {
  id?: number
  platform_name?: string
}
