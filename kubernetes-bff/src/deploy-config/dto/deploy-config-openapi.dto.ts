import { ResourceDesc } from 'deploy-config/dto/deploy-config.dto'

export interface ITemplateoverwrite {
  cid: string
  cluster: string
  type: string
}

export interface ITemplateConfig {
  type: string
  templateOverwrite: ITemplateoverwrite[]
}

export interface IRollingUpdate {
  maxUnavailable: string
  maxSurge: string
}

export interface IStrategyOverwrite {
  cid: string
  cluster: string
  type: string
  rollingUpdate?: IRollingUpdate
}

export interface IStrategyConfig {
  type: string
  rollingUpdate: IRollingUpdate
  strategyOverwrite: IStrategyOverwrite[]
}

export interface IInstance {
  cid: string
  cluster: string
  podCount: number
  enableCanary: boolean
  canaryInitCount: number
}

export interface ICidAzs {
  cid: string
  azs: string[]
}

export interface IDeployAz {
  cidAzs: ICidAzs[]
  instance: IInstance[]
}

export type CidResource = {
  [key: string]: ResourceDesc
}

export interface IResource {
  resource: ResourceDesc
  cidResource: CidResource
}

export interface IGetDeployConfigRequest {
  tenantId: number
  appName: string
  projectName: string
  env: string
}

export interface IGetDeployConfigResponse {
  code: number
  message: string
  enable: boolean
  syncWithLeap: boolean
  template: ITemplateConfig
  strategy: IStrategyConfig
  deployAz: IDeployAz
  resources: IResource
  version: number
}

export interface IUpdateDeployConfigRequest {
  tenantId: number
  appName: string
  projectName: string
  email: string
  env: string
  template: ITemplateConfig
  strategy: IStrategyConfig
  deployAz: IDeployAz
  resources: IResource
  version: number
}

export interface IUpdateDeployConfigResponse {
  code: string
  message: string
}
