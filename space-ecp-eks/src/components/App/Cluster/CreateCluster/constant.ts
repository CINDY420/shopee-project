import {
  IEKSClusterSpec,
  IEKSClusterServerList,
  IEKSClusterETCD,
  IEKSClusterNetworkingModel,
  IEKSClusterAdvance,
} from 'src/swagger-api/models'

export enum STEP {
  SERVER,
  CLUSTER_BASIC_INFO,
  CONFIRM,
}

export const FORM_WRAPPER_ID = 'create-cluster-form-wrapper'

// Server form interface
export interface IResourceInfo {
  azSegment: string[]
  env: string
  templateId: number
  service: string[]
}

export interface IServerForm {
  resourceInfo: IResourceInfo
  serverList: IEKSClusterServerList
}

// antd Form Item names
const SERVER_FORM_NAME = {
  RESOURCE_INFO_NAME: 'resourceInfo',
  SERVER_LIST_NAME: 'serverList',
} as const
export const RESOURCE_INFO_ITEM_NAME = {
  AZ_SEGMENT: [SERVER_FORM_NAME.RESOURCE_INFO_NAME, 'azSegment'],
  ENV: [SERVER_FORM_NAME.RESOURCE_INFO_NAME, 'env'],
  TEMPLATE: [SERVER_FORM_NAME.RESOURCE_INFO_NAME, 'templateId'],
  SERVICE: [SERVER_FORM_NAME.RESOURCE_INFO_NAME, 'service'],
}
export const SERVER_LIST_ITEM_NAME = {
  MASTER_IPS: [SERVER_FORM_NAME.SERVER_LIST_NAME, 'masterIPs'],
  WORK_IPS: [SERVER_FORM_NAME.SERVER_LIST_NAME, 'workIPs'],
}

// Basic info form interface

// DDN: Dotted Decimal Notation
export interface IClusterNetworkIPCidr {
  firstDDN: number
  secondDDN: number
  thirdDDN: number
  fourthDDN: number
  cidr: number
}

export interface IClusterNetwork {
  serviceCidrBlock: IClusterNetworkIPCidr
  podCidrBlock?: IClusterNetworkIPCidr
  nodeMask?: number
}
interface IExtraArgs {
  key: string
  value: string
}
interface IClusterAdvance
  extends Omit<
    IEKSClusterAdvance,
    'apiServerExtraArgs' | 'controllerManagementExtraArgs' | 'schedulerExtraArgs'
  > {
  apiServerExtraArgs: IExtraArgs[]
  controllerManagementExtraArgs: IExtraArgs[]
  schedulerExtraArgs: IExtraArgs[]
}

interface IClusterspec extends Omit<IEKSClusterSpec, 'platformName' | 'platformId'> {
  platform: string
}

export interface IBasicInfoForm {
  resourceInfo: IResourceInfo
  clusterSpec: IClusterspec
  etcd: IEKSClusterETCD
  networkingModel: IEKSClusterNetworkingModel
  clusterNetwork: IClusterNetwork
  advance: IClusterAdvance
}

// antd Form Item names
export const BASIC_INFO_FORM_NAME = {
  CLUSTER_SPEC: 'clusterSpec',
  ETCD: 'etcd',
  NETWORKING_MODEL: 'networkingModel',
  CLUSTER_NETWORK: 'clusterNetwork',
  ADVANCE: 'advance',
} as const
export const CLUSTER_SPEC_ITEM_NAME = {
  CLUSTER_NAME: [BASIC_INFO_FORM_NAME.CLUSTER_SPEC, 'clusterName'],
  PLATFORM: [BASIC_INFO_FORM_NAME.CLUSTER_SPEC, 'platform'],
  KUBERNETES_VERSION: [BASIC_INFO_FORM_NAME.CLUSTER_SPEC, 'kubernetesVersion'],
}
export const ETCD_ITEM_NAME = {
  ETCD_IPS: [BASIC_INFO_FORM_NAME.ETCD, 'IPs'],
  AUTHORITY: [BASIC_INFO_FORM_NAME.ETCD, 'authority'],
  CERTIFICATION: [BASIC_INFO_FORM_NAME.ETCD, 'certification'],
  KEY: [BASIC_INFO_FORM_NAME.ETCD, 'key'],
}
export const NETWORKING_MODEL_ITEM_NAME = {
  ENABLE_VPC_CNI: [BASIC_INFO_FORM_NAME.NETWORKING_MODEL, 'enableVpcCNI'],
  VPC: [BASIC_INFO_FORM_NAME.NETWORKING_MODEL, 'vpc'],
  ANCHOR_SERVER: [BASIC_INFO_FORM_NAME.NETWORKING_MODEL, 'anchorServer'],
}
export const CLUSTER_NETWORK_ITEM = {
  SERVICES_CIDR_BLOCK: [BASIC_INFO_FORM_NAME.CLUSTER_NETWORK, 'serviceCidrBlock'],
  POD_CIDR_BLOCK: [BASIC_INFO_FORM_NAME.CLUSTER_NETWORK, 'podCidrBlock'],
  NODE_MASK: [BASIC_INFO_FORM_NAME.CLUSTER_NETWORK, 'nodeMask'],
}
export const CLUSTER_NETWORK_SERVICES_CIDR_BLOCK_NAME = {
  FIRST_DDN: [...CLUSTER_NETWORK_ITEM.SERVICES_CIDR_BLOCK, 'firstDDN'],
  SECOND_DDN: [...CLUSTER_NETWORK_ITEM.SERVICES_CIDR_BLOCK, 'secondDDN'],
  THIRD_DDN: [...CLUSTER_NETWORK_ITEM.SERVICES_CIDR_BLOCK, 'thirdDDN'],
  FOURTH_DDN: [...CLUSTER_NETWORK_ITEM.SERVICES_CIDR_BLOCK, 'fourthDDN'],
  CIDR: [...CLUSTER_NETWORK_ITEM.SERVICES_CIDR_BLOCK, 'cidr'],
}
export const CLUSTER_NETWORK_POD_CIDR_BLOCK_NAME = {
  FIRST_DDN: [...CLUSTER_NETWORK_ITEM.POD_CIDR_BLOCK, 'firstDDN'],
  SECOND_DDN: [...CLUSTER_NETWORK_ITEM.POD_CIDR_BLOCK, 'secondDDN'],
  THIRD_DDN: [...CLUSTER_NETWORK_ITEM.POD_CIDR_BLOCK, 'thirdDDN'],
  FOURTH_DDN: [...CLUSTER_NETWORK_ITEM.POD_CIDR_BLOCK, 'fourthDDN'],
  CIDR: [...CLUSTER_NETWORK_ITEM.POD_CIDR_BLOCK, 'cidr'],
}

export const ADVANCE_ITEM_NAME = {
  ENABLE_DRAGONFLY: [BASIC_INFO_FORM_NAME.ADVANCE, 'enableDragonfly'],
  ENABLE_GPU: [BASIC_INFO_FORM_NAME.ADVANCE, 'enableGPU'],
  API_SERVER_EXTRA_ARGS: [BASIC_INFO_FORM_NAME.ADVANCE, 'apiServerExtraArgs'],
  CONTROLLER_MANAGEMENT_EXTRA_ARGS: [BASIC_INFO_FORM_NAME.ADVANCE, 'controllerManagementExtraArgs'],
  SCHEDULER_EXTRA_ARGS: [BASIC_INFO_FORM_NAME.ADVANCE, 'schedulerExtraArgs'],
  EVENT_ETCD: [BASIC_INFO_FORM_NAME.ADVANCE, 'eventEtcd'],
  ENABLE_LOG: [BASIC_INFO_FORM_NAME.ADVANCE, 'enableLog'],
  ENABLE_MONITORING: [BASIC_INFO_FORM_NAME.ADVANCE, 'enableMonitoring'],
  ENABLE_BROMO: [BASIC_INFO_FORM_NAME.ADVANCE, 'enableBromo'],
}
export const ADVANCE_EVENT_ETCD_ITEM_NAME = {
  ETCD_IPS: [...ADVANCE_ITEM_NAME.EVENT_ETCD, 'IPs'],
  AUTHORITY: [...ADVANCE_ITEM_NAME.EVENT_ETCD, 'authority'],
  CERTIFICATION: [...ADVANCE_ITEM_NAME.EVENT_ETCD, 'certification'],
  KEY: [...ADVANCE_ITEM_NAME.EVENT_ETCD, 'key'],
}
export const ADVANCE_EXTRA_ARGS_KEY_ITEM_NAME = 'key'
export const ADVANCE_EXTRA_ARGS_VALUE_ITEM_NAME = 'value'
