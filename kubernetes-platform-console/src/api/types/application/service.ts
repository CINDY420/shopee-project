export interface IListServices {
  groupName: string
  projectName: string
  svcs: IService[]
  totalCount: number
  cids: string[]
  clusters: string[]
  environments: string[]
}

export interface IService {
  name: string
  groupName: string
  projectName: string
  clusterId: string
  clusterName: string
  appName: string
  ip: string
  type: string
  cid: string
  environment: string
  ports?: string[]
  clusterIdSet: string[]
}

export interface IPort {
  name: string
  port: string
  protocol: string
  targetPort: string
}

export interface IServicePortList {
  groupName: string
  ports: IPort[]
  projectName: string
  serviceName: string
  totalCount: number
}

export interface IEndPoint {
  ip: string
  kind: string
  name: string
}

export interface IServiceEndPointList {
  endpoints: IEndPoint[]
  groupName: string
  projectName: string
  serviceName: string
  totalCount: number
}

export interface IServicePort {
  name?: string
  nodePort?: string
  port?: string
  protocol?: string
  targetPort?: string
}

export interface IServiceInfoV2 {
  cid?: string
  clusterId?: string
  clusterIp?: string
  clusterName?: string
  endPoints?: string[]
  env?: string
  externalIp?: string
  name?: string
  platform?: string
  portInfos?: IServicePort[]
  ports?: string[]
  type?: string
}
