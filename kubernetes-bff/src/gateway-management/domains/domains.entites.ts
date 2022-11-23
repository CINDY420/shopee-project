export interface IDomain {
  name: string
  env: string
  cid: string
  clusterName: string
  updater: string
  updateTime: string
  rules: Array<{
    path: string
    pathType?: string
    target: any
    priority: number
  }>
}
export interface IDomainGroup {
  name: string
  cid: string[]
  env: string[]
  cluster: string[]
  domain: Record<'name' | 'clusterName', string>[]
}
