import { IBaseAction } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import { FormInstance } from 'infrad/lib/form'
import * as React from 'react'

import { IDeployConfig } from 'swagger-api/v1/models'

export enum FORM_TYPE {
  COUNTRY_AZ = 'Country (CID) - Availability Zone (AZ)',
  ZONE_MANAGEMENT = 'Zone Management',
  COMPONENT_TYPE = 'Component Type',
  RESOURCES = 'Resources',
  INSTANCE_COUNT = 'Instance Count',
  MINIMUM_INSTANCE_COUNT = 'Minimum Instace Count',
  STRAEGY = 'Strategy',
  CANARY_DEPLOYMENT = 'Canary Deployment',
  EXTRA_CONFIG = 'Extra Config',
  ASSIGNMENT_POLICIES = 'Assignment Policies'
}

export const FORM_ANCHOR_KEY = {
  [FORM_TYPE.COUNTRY_AZ]: 'country-availability-zone',
  [FORM_TYPE.ZONE_MANAGEMENT]: 'zone-management',
  [FORM_TYPE.COMPONENT_TYPE]: 'component-type',
  [FORM_TYPE.RESOURCES]: 'resources',
  [FORM_TYPE.INSTANCE_COUNT]: 'instance-count',
  [FORM_TYPE.MINIMUM_INSTANCE_COUNT]: 'minimum-instance-count',
  [FORM_TYPE.STRAEGY]: 'straegy',
  [FORM_TYPE.CANARY_DEPLOYMENT]: 'canary-deployment',
  [FORM_TYPE.EXTRA_CONFIG]: 'extra-config',
  [FORM_TYPE.ASSIGNMENT_POLICIES]: 'assignment-policies'
}

export type DeployConfigErrors = Partial<Record<FORM_TYPE, boolean>>
export type DeployConfigForms = Partial<Record<FORM_TYPE, FormInstance>>

export interface IState {
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
  hybridDeployTenants: string[]
}

export const initialState: IState = {
  isEditing: false,
  errors: Object.values(FORM_TYPE).reduce<DeployConfigErrors>((previousValue, currentValue) => {
    previousValue[currentValue] = false
    return previousValue
  }, {}),
  deployConfigForms: Object.values(FORM_TYPE).reduce<DeployConfigForms>((previousValue, currentValue) => {
    previousValue[currentValue] = undefined
    return previousValue
  }, {}),
  deployConfig: {
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
      assignment_policies: []
    },
    strategy: {
      parameters: {},
      name: ''
    },
    k8s_strategy: {
      parameters: {},
      name: ''
    },
    cluster_instance: [],
    jenkins_config: '',
    strategy_override: []
  },
  newDeployConfig: {
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
      assignment_policies: []
    },
    strategy: {
      parameters: {},
      name: ''
    },
    k8s_strategy: {
      parameters: {},
      name: ''
    },
    jenkins_config: '',
    cluster_instance: [],
    strategy_override: []
  },
  countryAzsOptions: {},
  componentType: {
    bromo: [],
    nonBromo: []
  },
  nameMap: {},
  hybridDeployTenants: []
}

export const DeployConfigContext = React.createContext<{ state: IState; dispatch?: React.Dispatch<IBaseAction> }>({
  state: initialState
})
