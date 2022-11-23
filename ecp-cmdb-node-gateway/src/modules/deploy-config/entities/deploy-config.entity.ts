class ComponentType {
  workload_type: string
  orchestrator: string
}

class ComponentTypeOverride {
  cid: string
  data: ComponentType
  idc: string
}

class DeployConfigZone {
  cid: string
  az: string
  zone_name: string
}

class Env {
  cid: string
  data: {
    key: string
    value: string
  }
}

interface IIdcs {
  [key: string]: {
    [key: string]: string[]
  }
}

interface IInstances {
  [key: string]: {
    [key: string]: {
      [key: string]: number
    }
  }
}

class IClusterInstance {
  canary_init_count: number
  cid: string
  idc: string
}

class Resource {
  cpu: number
  disk: number
  mem: number
  gpu: number
}

class ResourceOverride {
  cid: string
  data: {
    cpu?: number
    mem?: number
    disk?: number
    gpu?: number
  }
}

class Selector {
  key: string
  operator: string
  value?: string
  values?: string[]
}

class AgentSelectors {
  selectors: Selector[]
}

class MaxPerUniqueKey {
  unique_key: string
  max_instances: number
}

class AssignmentPolice {
  name: string
  parameters: AgentSelectors | MaxPerUniqueKey
}

class Scheduler {
  orchestrator: {
    [key: string]: {
      [key: string]: string
    }
  }
  assignment_policies: AssignmentPolice[]
}

class Strategy {
  name: string
  parameters: {
    instances_per_agent?: number
    threshold?: number
    step_down?: number
    in_place?: boolean
    strict_in_place?: boolean
    reserve_resources?: boolean
    disable_restart?: boolean
    enable_canary_replacement?: boolean
    canary_stages?: string[]
    max_surge?: string
    max_unavailable?: string
  }
}

class StrategyOverride {
  cid: string
  data: {
    name: string
    parameters: {
      max_surge: string
      max_unavailable: string
    }
  }

  idc?: string
}

export class IPvcItem {
  idc: string
  pvc: string
}
export class Volume {
  cid: string
  mount_path: string
  pvcs: IPvcItem[]
}
export class Storage {
  name: string
  volumes: Volume[]
}
export class DeployConfig {
  annotations: Record<string, unknown>
  component_type: ComponentType[]
  component_type_overrides: ComponentTypeOverride[]
  deploy_zones: DeployConfigZone[]
  envs: Env[]

  idcs: IIdcs

  instances: IInstances

  minimum_instances: IInstances

  cluster_instance: IClusterInstance[]

  resources: {
    [key: string]: Resource
  }

  resources_override: ResourceOverride[]

  scheduler: Scheduler

  strategy: Strategy

  jenkins_config: string

  strategy_override: StrategyOverride[]

  storage: Storage
}

export class Commit {
  env: string
  comment: string
  created_by: string
  data: DeployConfig
  created_time: number
  project: string
  id: number
  service_id: number
  service_meta_type: string
}
