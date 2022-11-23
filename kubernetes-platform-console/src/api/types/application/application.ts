export interface IImage {
  name: string
  tag: string
}

export interface IPipeline {
  link: string
  tag: string
  status: string
}

export interface IVolume {
  mountPoint: string
  name: string
  readonly: string
  source: string
  type: string
}

export interface IDeploy {
  buildId: string
  deployTime: string
  imageName: string
  pipelineName: string
  podCount: number
  tag: string
  clusterId: string
  phase: string
}

export interface IApplication {
  clusterId: string
  deploys: IDeploy[]
  desiredPodCount: number
  envPods: {
    [key: string]: {
      abnormalPodCount: number
      name: string
      normalPodCount: number
    }
  }
  envs: string[]
  tenantId: string
  healthyPodCount: number
  images: Record<'name' | 'tag', string>[]
  name: string
  pipeline: {
    link: string
    status: string
    tag: string
  }
  projectName: string
  status: string
  volumes: Record<'mountPoint' | 'name' | 'readonly' | 'source' | 'type', string>[]
}

export interface IApplicationList {
  apps: IApplication[]
  groupName: string
  projectName: string
  totalCount: number
}

export interface ICreateApplicationParam {
  tenantId: number
  projectName: string
  appName: string
  pipeline: string
}

export interface IDeleteApplicationParam {
  tenantId: number
  projectName: string
  appName: string
}

interface ITemplateOverwriteItem {
  cid: string
  clusters: string[]
  type: string
}

export interface ITemplate {
  type: string
  templateOverwriteList: ITemplateOverwriteItem[]
}

interface IRollingUpdate {
  maxSurge: number
  maxUnavailable: number
}

export enum STRATEGY_TYPE {
  RollingUpdate = 'RollingUpdate',
  Recreate = 'Recreate'
}

export interface IStrategyOverwriteItem {
  cid: string
  clusters: string[]
  type: STRATEGY_TYPE
  rollingUpdate?: IRollingUpdate
}

export interface IStrategy {
  type: STRATEGY_TYPE
  rollingUpdate: IRollingUpdate
  strategyOverwrite: IStrategyOverwriteItem[]
}

export interface IDeployAzCidAz {
  cids: string[]
  azs: string[]
}

export interface IDeployAzDeployDetailInstance {
  cluster: string
  podCount: number
  enableCanary: boolean
  canaryInitCount: number
}
export interface IDeployAzDeployDetail {
  cid: string
  instances: IDeployAzDeployDetailInstance[]
}
export interface IDeployAz {
  cidAzs: IDeployAzCidAz[]
  deployDetailList: IDeployAzDeployDetail[]
}

interface IResource {
  cpu: number
  gpu: number
  memory: number
}

interface IFlavorResource extends IResource {
  isFlavor: boolean
  flavor: string
  isCpu?: boolean
  isGpu?: boolean
}

export interface ICidResourceItem {
  cids: string[]
  resourceDesc: IResource
}

interface ICidFlavorResourceItem {
  cids: string[]
  resourceDesc: IFlavorResource
}

export interface IResources {
  resource: IResource
  cidResourceList: ICidResourceItem[]
}

export interface IApplicationDeployConfig {
  enable?: boolean
  syncWithLeap?: boolean
  template: ITemplate
  strategy: IStrategy
  deployAz: IDeployAz
  resources: IResources
  version: number
}

export interface IFlavorResources {
  resource: IFlavorResource
  cidResourceList: ICidFlavorResourceItem[]
}
