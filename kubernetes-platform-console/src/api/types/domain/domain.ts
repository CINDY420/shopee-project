export interface IDomainGroup {
  name: string
  env: string[]
  cid: string[]
}

export interface IDomainGroupsList {
  domainGroups: IDomainGroup[]
  total: number
}

export interface IRule {
  path: string
  pathType: string
  target: {
    type: string
    service: string
  }
}

export interface IDomainInfo {
  name: string
  env: string
  cid: string
  cluster: string
  updater: string
  updateTime: string
}

export interface IDomain extends IDomainInfo {
  rules: IRule[]
  total: number
  pathTypeList: string[]
}

export interface IDomainsList {
  name: string
  cid: string
  env: string
  total: number
  clusterName: string
  domain: IDomainInfo[]
}
