export interface ICustomConfigs {
  name: string
  value: string
}

export interface IIngress {
  apps?: string[]
  clusterId: string
  clusterName: string
  environment: string
  groupName: string
  ips?: string[]
  name: string
  projectName: string
  protocol?: string
  cid: string
  clusterIdSet?: string[]
  hosts?: string[]
}

export interface IIngressesList {
  ingresses: IIngress[]
  groupName: string
  projectName: string
  totalCount: number
  cids: string[]
  clusters: string[]
  environments: string[]
}

export interface IRule {
  host: string
  path: string
  svcName: string
  targetPort: string
}

export interface IIngressRules {
  groupName: string
  projectName: string
  ingressName: string
  rules: IRule[]
  totalCount: number
}

export interface IIngressConfigs {
  groupName: string
  projectName: string
  ingressName: string
  configs: ICustomConfigs[]
  totalCount: number
}

export interface IPaths {
  pathName: string
  pathType: string
  serviceName: string
  servicePort: string
}

export interface IHosts {
  name: string
  paths: IPaths[]
}

export interface IAnnotations {
  key: string
  value: string
}

export interface IIngresses {
  name: string
  hosts: IHosts[]
  annotations: IAnnotations[]
}
