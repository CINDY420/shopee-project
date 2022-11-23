import { IBaseAction } from 'src/components/DeployConfig/useDeployConfigContext'
import { FormInstance } from 'infrad/lib/form'
import * as React from 'react'

import { IModels } from 'src/rapper/request'
import { ICid } from 'src/components/DeployConfig/useDeployConfigContext/reducer'

type IDeployConfig = IModels['GET/api/ecp-cmdb/deploy-config/commits']['Res']['commits'][0]['data']

export enum FormType {
  COUNTRY_AZ = 'Country (CID) - Availability Zone (AZ)',
  ZONE_MANAGEMENT = 'Zone Management',
  COMPONENT_TYPE = 'Workload Type',
  RESOURCES = 'Pod Flavor',
  STORAGE = 'Storage',
  INSTANCE_COUNT = 'Instance Count',
  MINIMUM_INSTANCE_COUNT = 'Minimum Instance Count',
  STRAEGY = 'Strategy',
  CANARY_DEPLOYMENT = 'Canary Deployment',
  EXTRA_CONFIG = 'Extra Config',
  ASSIGNMENT_POLICIES = 'Assignment Policies',
  ANNOTATIONS = 'Annotations',
}

export const FormAnchorKey = {
  [FormType.COUNTRY_AZ]: 'country-availability-zone',
  [FormType.ZONE_MANAGEMENT]: 'zone-management',
  [FormType.COMPONENT_TYPE]: 'workload-type',
  [FormType.RESOURCES]: 'pod-flavor',
  [FormType.STORAGE]: 'storage',
  [FormType.INSTANCE_COUNT]: 'instance-count',
  [FormType.MINIMUM_INSTANCE_COUNT]: 'minimum-instance-count',
  [FormType.STRAEGY]: 'strategy',
  [FormType.CANARY_DEPLOYMENT]: 'canary-deployment',
  [FormType.EXTRA_CONFIG]: 'extra-config',
  [FormType.ASSIGNMENT_POLICIES]: 'assignment-policies',
  [FormType.ANNOTATIONS]: 'annotations',
}

export enum StrategyEngine {
  BROMO = 'bromo',
  KUBERNETES = 'kubernetes',
  BROMO_AND_KUBERNETES = 'bromoAndKubernetes',
}

export type DeployConfigErrors = Partial<Record<FormType, boolean>>
export type DeployConfigForms = Partial<Record<FormType, FormInstance>>
export type ICommits = IModels['GET/api/ecp-cmdb/deploy-config/commits']['Res']['commits']
export type ICurrentCommit = IModels['GET/api/ecp-cmdb/deploy-config/commits']['Res']['commits'][0]
export type IListWorkloads = IModels['GET/api/ecp-cmdb/workloads']['Res']['items']
export interface IState {
  strategyEngine: StrategyEngine
  cids: ICid[]
  env: string
  currentCommit: ICurrentCommit
  isEditing: boolean
  errors: DeployConfigErrors
  deployConfig: IDeployConfig
  newDeployConfig: IDeployConfig
  deployConfigForms: DeployConfigForms
  countryAzsOptions: Record<string, string[]>
  componentType: {
    bromo: string[]
    nonBromo: string[]
  }
  nameMap: Record<string, string>
  hybridDeployTenants: number[]
  workloads: IListWorkloads
  textarea: string
  updatedCidAz: Record<string, string>
}

export const initialState: IState = {
  workloads: [],
  strategyEngine: undefined,
  cids: undefined,
  currentCommit: undefined,
  env: '',
  isEditing: false,
  errors: Object.values(FormType).reduce<DeployConfigErrors>((previousValue, currentValue) => {
    previousValue[currentValue] = false
    return previousValue
  }, {}),
  deployConfigForms: Object.values(FormType).reduce<DeployConfigForms>(
    (previousValue, currentValue) => {
      previousValue[currentValue] = undefined
      return previousValue
    },
    {},
  ),
  deployConfig: {
    annotations_global: {},
    annotations: {},
    idcs: {},
    instances: {},
    minimum_instances: {},
    resources: {},
    component_type: [],
    component_type_overrides: [],
    deploy_zones: [],
    envs: [],
    resources_override: [],
    scheduler: {
      orchestrator: {},
      assignment_policies: [],
    },
    strategy: {
      parameters: {},
      name: '',
    },
    cluster_instance: [],
    jenkins_config: '',
    strategy_override: [],
    storage: undefined,
  },
  newDeployConfig: {
    annotations_global: {},
    annotations: {},
    idcs: {},
    instances: {},
    minimum_instances: {},
    resources: {},
    component_type: [],
    component_type_overrides: [],
    deploy_zones: [],
    envs: [],
    resources_override: [],
    scheduler: {
      orchestrator: {},
      assignment_policies: [],
    },
    strategy: {
      parameters: {},
      name: '',
    },
    jenkins_config: '',
    cluster_instance: [],
    strategy_override: [],
    storage: undefined,
  },
  countryAzsOptions: {},
  componentType: {
    bromo: [],
    nonBromo: [],
  },
  nameMap: {},
  hybridDeployTenants: [],
  textarea: '',
  updatedCidAz: undefined,
}

export const DeployConfigContext = React.createContext<{
  state: IState
  dispatch?: React.Dispatch<IBaseAction>
}>({
  state: initialState,
})
