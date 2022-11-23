import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger'

class ComponentType {
  workload_type: string
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

@ApiExtraModels(AgentSelectors)
@ApiExtraModels(MaxPerUniqueKey)
class AssignmentPolice {
  name: string

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(AgentSelectors) }, { $ref: getSchemaPath(MaxPerUniqueKey) }],
    description: '两种类型的assignment police, agent selector 和 max per unique key',
  })
  parameters: AgentSelectors | MaxPerUniqueKey
}

class Scheduler {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'object',
      additionalProperties: {
        type: 'string',
      },
    },
  })
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

  idc: string
}

@ApiExtraModels(Resource)
export class DeployConfig {
  @ApiProperty({
    type: 'object',
  })
  annotations: Record<string, unknown>

  component_type: ComponentType[]
  component_type_overrides: ComponentTypeOverride[]
  deploy_zones: DeployConfigZone[]
  envs: Env[]

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'object', additionalProperties: { type: 'array', items: { type: 'string' } } },
  })
  idcs: IIdcs

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'object',
      additionalProperties: { type: 'object', additionalProperties: { type: 'integer' } },
    },
  })
  instances: IInstances

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'object',
      additionalProperties: { type: 'object', additionalProperties: { type: 'integer' } },
    },
  })
  minimum_instances: IInstances

  cluster_instance: IClusterInstance[]

  @ApiProperty({
    type: 'object',
    additionalProperties: { $ref: getSchemaPath(Resource) },
  })
  resources: {
    [key: string]: Resource
  }

  resources_override: ResourceOverride[]

  scheduler: Scheduler

  strategy: Strategy

  k8s_strategy: Strategy

  jenkins_config: string

  strategy_override: StrategyOverride[]
}
