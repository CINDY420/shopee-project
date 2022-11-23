interface IMetadata {
  name: string
  namespace?: string
  annotations?: {
    [annotation: string]: any
  }
  labels?: Record<string, string>
  resourceVersion?: string
  creationTimestamp?: string
  finalizers?: string[]
  generation?: number
  selfLink?: string
  uid?: string
}

export interface IBaseCrdObject {
  apiVersion?: string
  kind?: string
  metadata: IMetadata
}

export interface IClusterCrdObject extends IBaseCrdObject {
  spec: {
    kubeconfig: string
    envs: string[]
    groups: string[]
    cids: string[]
    tenants: string[]
  }
  status?: unknown
}

interface IQuota {
  cluster: string
  cpu: string | number
  env: string
  memory: string | number
  name: string
}

export interface ITenantCrdObject extends IBaseCrdObject {
  spec: {
    alias: string
    quotas: IQuota[]
  }
  status?: unknown
}

export interface IProjectCrdObject extends IBaseCrdObject {
  spec: {
    group?: string
    tenant: string
    project: string
    environments: string[]
    clusters: string[]
    cids: string[]
    relations: string[]
    quotas: IQuota[]
    source?: string
  }
  status?: {
    phase: string
    readyNamespaces: string[]
  }
}

export interface IApplicationCrdObject extends IBaseCrdObject {
  spec: {
    project: string
  }
  status?: {
    cids: string[]
    environments: string[]
    status: string
    clusters: string[]
  }
}

export interface IDeploySpec {
  containers: Record<'image' | 'memLimit' | 'name', string>[]
  replicas: number
}

export interface IApplicationInstanceCrdObject extends IBaseCrdObject {
  spec: {
    group: string
    project: string
    application: string
    env: string
    cid: string
    cluster: string
    instance: string
    reconcileTime: number
    deploySpec: IDeploySpec
    canaryDeploySpec: IDeploySpec
    source: string
  }
  status: {
    abnormalPodCount: number
    runningPodCount: number
    canaryCount: number
    phase: string[]
    podCount: number
    releaseCount: number
    status: string
    updateTime: Date
  }
}

export interface IProfDescriptorCrdObject extends IBaseCrdObject {
  spec: {
    podToProf: {
      IP: string
      Port: number
    }
    profileReq: {
      profileDuration: number
      profileType: string
    }
  }
}

export interface IApplicationInstanceOamCrdObject {
  spec: {
    components: { type: string }[]
    environments: {
      application: string
      env: string
      cid: string
      cluster: string
      group: string
      project: string
      tenant: string
    }
  }
  metadata: {
    labels: {
      feature: string
    }
  }

  status: any
}

export interface IListCrdBody<T> {
  apiVersion: string
  items: T[]
}

export interface IBaseNamespacedCustomObject {
  plural: string
  group?: string
  version?: string
  namespace?: string
}
export interface IListNamespacedCustomObject extends IBaseNamespacedCustomObject {
  pretty?: string
  _continue?: string
  fieldSelector?: string
  labelSelector?: string
  limit?: number
  resourceVersion?: string
  timeoutSeconds?: number
  watch?: boolean
}

export interface IGetOrDeleteNamespacedCustomObject extends IListNamespacedCustomObject {
  name: string
}

export interface ICreateNamespacedCustomObject<T extends IBaseCrdObject = IBaseCrdObject>
  extends IBaseNamespacedCustomObject {
  crdObject: T
}

export interface IPatchOrReplaceNamespacedCustomObject<T extends IBaseCrdObject = IBaseCrdObject>
  extends IListNamespacedCustomObject {
  name: string
  crdObject: T
}

export interface ICreateProfDescriptorNamespacedCustomObject<T extends IBaseCrdObject>
  extends IBaseNamespacedCustomObject {
  crdObject: T
}
