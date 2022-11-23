export interface ITenant {
  id: number
  name: string
  // envs: string[]
  // cids: string[]
  // clusters: string[]
}

export interface ITenantList {
  tenantList: ITenant[]
  // cids: string[]
  // envs: string[]
  // clusters: string[]
  totalCount: number
}

export interface ITenantConfig {
  envs: string[]
  cids: string[]
  clusters: string[]
}
